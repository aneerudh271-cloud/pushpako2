import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Participation from "@/lib/models/Participation"
import HackathonUser from "@/lib/models/HackathonUser"
import { getAuthUser } from "@/lib/getAuthUser"

export async function GET(request) {
    try {
        await connectDB()
        const user = await getAuthUser()

        if (!user) {
            return NextResponse.json({ registered: false, status: null })
        }

        const { searchParams } = new URL(request.url)
        const hackathonId = searchParams.get('hackathonId')

        if (!hackathonId) {
            return NextResponse.json({ error: "hackathonId required" }, { status: 400 })
        }

        // We need to find the HackathonUser linked to this auth user's email
        const hackathonUser = await HackathonUser.findOne({ email: user.email })

        if (!hackathonUser) {
            return NextResponse.json({ registered: false, status: null })
        }

        const participation = await Participation.findOne({
            user: hackathonUser._id,
            hackathon: hackathonId
        })

        if (!participation) {
            return NextResponse.json({ registered: false, status: null })
        }

        return NextResponse.json({
            registered: true,
            status: participation.status,
            participationId: participation._id,
            teamName: participation.teamName,
            teamMembers: participation.teamMembers,
            participationCode: participation.participationCode
        })
    } catch (error) {
        console.error("Error fetching participation status:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
