import { connectDB } from "@/lib/db/connectDB"
import Team from "@/lib/models/Team"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// GET /api/team/[id] - Get a single team member by ID
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    const teamMember = await Team.findById(id)

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/team/[id] - Update a team member
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()

    // Disable runValidators to prevent phantom schema issues with removed fields (email)
    const teamMember = await Team.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: false
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    // Revalidate paths
    revalidatePath('/our-team');
    revalidatePath('/');

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/team/[id] - Delete a team member
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    const teamMember = await Team.findByIdAndDelete(id)

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    // Revalidate paths
    revalidatePath('/our-team');
    revalidatePath('/');

    return NextResponse.json({ message: "Team member deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}