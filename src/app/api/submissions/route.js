import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Submission from "@/lib/models/Submission"
import Participation from "@/lib/models/Participation"
import Token from "@/lib/models/Token"
import Hackathon from "@/lib/models/Hackathon"
import { getAuthUser } from "@/lib/getAuthUser"

export async function GET(request) {
    try {
        await connectDB()
        const user = await getAuthUser()

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const hackathonId = searchParams.get('hackathonId')

        if (!hackathonId) {
            return NextResponse.json({ error: "hackathonId required" }, { status: 400 })
        }

        // Check ownership
        /*
        if (user.role === 'hackathon_manager' && hackathon.createdBy.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        */

        const participations = await Participation.find({ hackathon: hackathonId, status: 'SUBMITTED' })
            .populate('user', 'name email')

        const submissions = await Submission.find({
            participation: { $in: participations.map(p => p._id) }
        }).populate({
            path: 'participation',
            populate: {
                path: 'user',
                select: 'name email'
            }
        })

        return NextResponse.json({ submissions })
    } catch (error) {
        console.error("Error fetching submissions:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        await connectDB()

        const { code, markdownFile, githubRepo, demoLink } = await request.json()

        if (!code) {
            return NextResponse.json({ error: "Participation code required" }, { status: 400 })
        }

        // Validate code
        const token = await Token.findOne({ code }).populate('participation')

        if (!token || token.isUsed || token.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
        }

        if (token.participation.status !== 'APPROVED') {
            return NextResponse.json({ error: "Participation not approved" }, { status: 400 })
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({ participation: token.participation._id })
        if (existingSubmission) {
            return NextResponse.json({ error: "Already submitted" }, { status: 400 })
        }

        // Create submission
        const submission = new Submission({
            participation: token.participation._id,
            markdownFile,
            githubRepo,
            demoLink
        })

        await submission.save()

        // Mark token as used and participation as submitted
        token.isUsed = true
        await token.save()

        token.participation.status = 'SUBMITTED'
        await token.participation.save()

        return NextResponse.json({ submission, message: "Submitted successfully" }, { status: 201 })
    } catch (error) {
        console.error("Error submitting:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}