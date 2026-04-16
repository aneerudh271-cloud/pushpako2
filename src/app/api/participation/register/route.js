import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Participation from "@/lib/models/Participation"
import HackathonUser from "@/lib/models/HackathonUser"
import Hackathon from "@/lib/models/Hackathon"
import { getAuthUser } from "@/lib/getAuthUser"

export async function POST(request) {
    try {
        await connectDB()
        const user = await getAuthUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { hackathonId, teamName, teamMembers } = await request.json()

        if (!hackathonId) {
            return NextResponse.json({ error: "hackathonId required" }, { status: 400 })
        }

        // Check if hackathon exists and is active
        const hackathon = await Hackathon.findById(hackathonId)
        if (!hackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
        }

        if (hackathon.status === 'ENDED') {
            return NextResponse.json({ error: "Registration closed" }, { status: 400 })
        }

        // Validate Team Settings
        if (hackathon.teamSettings.teamType === 'TEAM') {
            if (!teamMembers || teamMembers.length < hackathon.teamSettings.minTeamSize || teamMembers.length > hackathon.teamSettings.maxTeamSize) {
                return NextResponse.json({ error: `Team size must be between ${hackathon.teamSettings.minTeamSize} and ${hackathon.teamSettings.maxTeamSize}` }, { status: 400 });
            }

            if (hackathon.teamSettings.requireGenderBalance) {
                const males = teamMembers.filter(m => m.gender === 'MALE').length;
                const females = teamMembers.filter(m => m.gender === 'FEMALE').length;

                if (males < hackathon.teamSettings.minMale) {
                    return NextResponse.json({ error: `At least ${hackathon.teamSettings.minMale} male member(s) required` }, { status: 400 });
                }
                if (females < hackathon.teamSettings.minFemale) {
                    return NextResponse.json({ error: `At least ${hackathon.teamSettings.minFemale} female member(s) required` }, { status: 400 });
                }
            }
        }

        // Find or create user
        let hackathonUser = await HackathonUser.findOne({ email: user.email })
        if (!hackathonUser) {
            hackathonUser = new HackathonUser({
                name: user.name,
                email: user.email,
            })
            await hackathonUser.save()
        }

        // Check if already registered
        const existingParticipation = await Participation.findOne({ user: hackathonUser._id, hackathon: hackathonId })
        if (existingParticipation) {
            return NextResponse.json({ error: "Already registered" }, { status: 400 })
        }

        // Create participation
        const participation = new Participation({
            user: hackathonUser._id,
            hackathon: hackathonId,
            teamName,
            teamMembers,
            status: 'REGISTERED', // For now default to registered (will be updated by payment logic if fee > 0)
            paymentStatus: hackathon.registrationFee > 0 ? 'PENDING' : 'NA',
            participationCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        })

        await participation.save()

        return NextResponse.json({ participation: { id: participation._id, status: participation.status }, message: "Registered successfully" }, { status: 201 })
    } catch (error) {
        console.error("Error registering for hackathon:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
