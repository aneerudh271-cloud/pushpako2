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

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // We need to find the HackathonUser _id corresponding to this session user
        // If the session user IS the HackathonUser (from auth token), user.id might be sufficient
        // But let's be safe and look up by email for HackathonUser specifically if role is hackathon_user

        let userId = user.id;

        if (user.role === 'hackathon_user') {
            // Logic in getAuthUser might return id from token which matches DB _id
            // But just to be sure we are querying the right model context
        }

        const participations = await Participation.find({ user: userId })
            .populate('hackathon', 'title slug bannerImage status timeline')
            .sort({ registeredAt: -1 })

        return NextResponse.json({ participations })
    } catch (error) {
        console.error("Error fetching user participations:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
