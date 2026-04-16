import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Token from "@/lib/models/Token"
import Participation from "@/lib/models/Participation"

export async function POST(request) {
    try {
        await connectDB()

        const { code } = await request.json()

        if (!code) {
            return NextResponse.json({ error: "Code required" }, { status: 400 })
        }

        const token = await Token.findOne({ code }).populate({
            path: 'participation',
            populate: {
                path: 'hackathon',
                select: 'title status timeline'
            }
        })

        if (!token) {
            return NextResponse.json({ error: "Invalid code" }, { status: 400 })
        }

        if (token.isUsed) {
            return NextResponse.json({ error: "Code already used" }, { status: 400 })
        }

        if (token.expiresAt < new Date()) {
            return NextResponse.json({ error: "Code expired" }, { status: 400 })
        }

        if (token.participation.status !== 'APPROVED') {
            return NextResponse.json({ error: "Participation not approved" }, { status: 400 })
        }

        return NextResponse.json({
            participation: {
                id: token.participation._id,
                hackathon: token.participation.hackathon
            }
        })
    } catch (error) {
        console.error("Error validating code:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}