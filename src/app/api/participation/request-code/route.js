import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Participation from "@/lib/models/Participation"
import HackathonUser from "@/lib/models/HackathonUser"
import Token from "@/lib/models/Token"
import { getAuthUser } from "@/lib/getAuthUser"
import crypto from 'crypto'

export async function POST(request) {
    try {
        await connectDB()
        const user = await getAuthUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { hackathonId } = await request.json()

        if (!hackathonId) {
            return NextResponse.json({ error: "hackathonId required" }, { status: 400 })
        }

        const hackathonUser = await HackathonUser.findOne({ email: user.email })
        if (!hackathonUser) return NextResponse.json({ error: "Not registered" }, { status: 404 })

        const participation = await Participation.findOne({ user: hackathonUser._id, hackathon: hackathonId })
        if (!participation) return NextResponse.json({ error: "Participation not found" }, { status: 404 })

        if (participation.status !== 'APPROVED') {
            return NextResponse.json({ error: "Participation must be APPROVED to request code" }, { status: 400 })
        }

        // Check existing active token
        const existingToken = await Token.findOne({
            participation: participation._id,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        })

        if (existingToken) {
            return NextResponse.json({ code: existingToken.code })
        }

        // Generate new code
        const code = crypto.randomBytes(4).toString('hex').toUpperCase()

        const token = new Token({
            participation: participation._id,
            code,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours validity
        })

        await token.save()

        return NextResponse.json({ code })
    } catch (error) {
        console.error("Error generating code:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
