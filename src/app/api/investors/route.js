import { connectDB } from "@/lib/db/connectDB"
import Investor from "@/lib/models/Investor"
import { NextResponse } from "next/server"

// GET /api/investors - Get all investors with optional filtering
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const stage = searchParams.get('stage')

    let query = {}

    if (type && type !== 'all') {
      query.type = type
    }

    if (status && status !== 'all') {
      query.status = status
    }

    if (stage && stage !== 'all') {
      query.investmentStage = stage
    }

    const investors = await Investor.find(query).sort({ createdAt: -1 })

    return NextResponse.json(investors)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/investors - Create a new investor
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    const investor = await Investor.create(data)
    return NextResponse.json(investor, { status: 201 })
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Investor with this email already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}