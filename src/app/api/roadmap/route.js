import { connectDB } from "@/lib/db/connectDB"
import Roadmap from "@/lib/models/Roadmap"
import { NextResponse } from "next/server"

// GET /api/roadmap - Get all roadmap items with optional filtering
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = {}

    if (status && status !== 'all') {
      query.status = status
    }

    const roadmap = await Roadmap.find(query).sort({ quarter: 1 })

    return NextResponse.json(roadmap)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/roadmap - Create a new roadmap item
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    const roadmapItem = await Roadmap.create(data)
    return NextResponse.json(roadmapItem, { status: 201 })
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Roadmap item with this ID already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}