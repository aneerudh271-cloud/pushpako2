import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Participation from "@/lib/models/Participation"

export async function POST(request) {
    try {
        await connectDB()

        const { participationId } = await request.json()

        if (!participationId) {
            return NextResponse.json({ error: "participationId required" }, { status: 400 })
        }

        const participation = await Participation.findById(participationId)

        if (!participation) {
            return NextResponse.json({ error: "Participation not found" }, { status: 404 })
        }

        if (participation.status !== 'REGISTERED') {
            return NextResponse.json({ error: "Invalid status for code request" }, { status: 400 })
        }

        participation.status = 'CODE_REQUESTED'
        await participation.save()

        return NextResponse.json({ message: "Code request submitted" })
    } catch (error) {
        console.error("Error requesting code:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}