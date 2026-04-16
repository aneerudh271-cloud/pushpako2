import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Participation from "@/lib/models/Participation"
import HackathonUser from "@/lib/models/HackathonUser"
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

        // Check if user owns the hackathon
        const hackathon = await Hackathon.findById(hackathonId)
        if (!hackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
        }

        /*
        if (user.role === 'hackathon_manager' && hackathon.createdBy.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        */

        const participations = await Participation.find({ hackathon: hackathonId })
            .populate('user', 'name email phone')
            .sort({ registeredAt: -1 })

        return NextResponse.json({ participations })
    } catch (error) {
        console.error("Error fetching participations:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        await connectDB()

        const { hackathonId, name, email, phone } = await request.json()

        if (!hackathonId || !name || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Check if hackathon exists and is active
        const hackathon = await Hackathon.findById(hackathonId)
        if (!hackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
        }

        if (hackathon.status === 'ENDED') {
            return NextResponse.json({ error: "Registration closed" }, { status: 400 })
        }

        // Find or create user
        let user = await HackathonUser.findOne({ email })
        if (!user) {
            user = new HackathonUser({ name, email, phone })
            await user.save()
        }

        // Check if already registered
        const existingParticipation = await Participation.findOne({ user: user._id, hackathon: hackathonId })
        if (existingParticipation) {
            return NextResponse.json({ error: "Already registered" }, { status: 400 })
        }

        // Create participation
        const participation = new Participation({
            user: user._id,
            hackathon: hackathonId
        })

        await participation.save()

        return NextResponse.json({ participation: { id: participation._id }, message: "Registered successfully" }, { status: 201 })
    } catch (error) {
        console.error("Error registering for hackathon:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}