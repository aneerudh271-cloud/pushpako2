import { connectDB } from "@/lib/db/connectDB"
import Service from "@/lib/models/Service"
import { NextResponse } from "next/server"

// GET /api/services - Get all services with optional filtering
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const popular = searchParams.get('popular')

    let query = {}

    if (category && category !== 'all') {
      query.category = category
    }

    if (status && status !== 'all') {
      query.status = status
    }

    if (popular === 'true') {
      query.isPopular = true
    }

    const services = await Service.find(query).sort({ order: 1 })

    return NextResponse.json(services)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/services - Create a new service
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }

    const service = await Service.create(data)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Service with this slug already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}