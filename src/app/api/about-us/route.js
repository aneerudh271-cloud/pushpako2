import { connectDB } from "@/lib/db/connectDB"
import AboutUs from "@/lib/models/AboutUs"
import { aboutUsPageData } from "@/lib/data/companyData"
import { NextResponse } from "next/server"

// GET /api/about-us - Get about us content with fallback to hardcoded data
export async function GET() {
  try {
    await connectDB()

    // Get the first (and likely only) about us document
    const aboutUs = await AboutUs.findOne()

    if (!aboutUs) {
      // Return hardcoded data as fallback
      console.log("No database data found, returning hardcoded data")
      return NextResponse.json(aboutUsPageData)
    }

    // Merge database data with hardcoded data for any missing fields
    const mergedData = {
      ...aboutUsPageData,
      ...aboutUs.toObject(),
      hero: {
        ...aboutUsPageData.hero,
        ...(aboutUs.hero || {}),
      },
      vision: {
        ...aboutUsPageData.vision,
        ...(aboutUs.vision || {}),
      },
      mission: aboutUs.mission?.items?.length > 0 ? aboutUs.mission : aboutUsPageData.mission,
      values: aboutUs.values?.length > 0 ? aboutUs.values : aboutUsPageData.values,
      corePhilosophy: aboutUs.corePhilosophy?.length > 0 ? aboutUs.corePhilosophy : aboutUsPageData.corePhilosophy,
      stats: aboutUs.stats?.length > 0 ? aboutUs.stats : aboutUsPageData.stats,
    }

    return NextResponse.json(mergedData)
  } catch (error) {
    console.error("Database error, returning hardcoded data:", error)
    // Return hardcoded data on database error
    return NextResponse.json(aboutUsPageData)
  }
}

// POST /api/about-us - Create about us content (if doesn't exist)
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    // Check if about us content already exists
    const existing = await AboutUs.findOne()
    if (existing) {
      return NextResponse.json({ error: "About us content already exists" }, { status: 400 })
    }

    const aboutUs = await AboutUs.create(data)
    return NextResponse.json(aboutUs, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/about-us - Update about us content (supports partial updates)
export async function PUT(request) {
  try {
    await connectDB()
    const data = await request.json()

    // Validate that data is an object
    if (typeof data !== 'object' || data === null) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Optional: Add specific validation for allowed fields
    const allowedSections = [
      'hero', 'vision', 'mission', 'values', 'corePhilosophy',
      'keyDomains', 'technologyCapabilities', 'makeInIndiaCommitment',
      'regulatoryCompliance', 'footer', 'stats', 'companyName',
      'brandName', 'tagline'
    ]
    const providedSections = Object.keys(data)

    // Check if all provided keys are allowed sections
    const invalidSections = providedSections.filter(section => !allowedSections.includes(section))
    if (invalidSections.length > 0) {
      return NextResponse.json({
        error: `Invalid sections: ${invalidSections.join(', ')}. Allowed sections: ${allowedSections.join(', ')}`
      }, { status: 400 })
    }

    const aboutUs = await AboutUs.findOneAndUpdate({}, data, {
      new: true,
      upsert: true, // Create if doesn't exist
      runValidators: true
    })

    return NextResponse.json(aboutUs)
  } catch (error) {
    console.error('Error updating about us:', error)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        error: "Validation failed",
        details: Object.values(error.errors).map(err => err.message)
      }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
