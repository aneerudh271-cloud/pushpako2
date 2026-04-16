import { connectDB } from "@/lib/db/connectDB"
import Team from "@/lib/models/Team"
import { leadershipTeam } from "@/lib/data/companyData"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// GET /api/team - Get all team members with optional filtering and fallback to hardcoded data
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const active = searchParams.get('active')

    let query = {}

    if (department && department !== 'all') {
      query.department = department
    }

    const team = await Team.find(query).sort({ order: 1, createdAt: -1 })

    // If no team members found in database, return hardcoded leadership data
    if (team.length === 0) {
      console.log("No team members in database, returning hardcoded leadership data")

      // Filter hardcoded data based on query params
      let filteredTeam = [...leadershipTeam]

      if (department && department !== 'all') {
        filteredTeam = filteredTeam.filter(member => member.department === department)
      }

      return NextResponse.json(filteredTeam)
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error("Database error, returning hardcoded data:", error)
    // Return hardcoded data on database error
    return NextResponse.json(leadershipTeam)
  }
}

// POST /api/team - Create a new team member
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    const teamMember = await Team.create(data)

    // Revalidate the team page and homepage to reflect changes immediately
    revalidatePath('/our-team');
    revalidatePath('/');

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
