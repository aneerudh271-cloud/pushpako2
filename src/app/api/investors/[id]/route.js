import { connectDB } from "@/lib/db/connectDB"
import Investor from "@/lib/models/Investor"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

// GET /api/investors/[id] - Get a single investor by ID
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    let investor;
    if (mongoose.Types.ObjectId.isValid(id)) {
      investor = await Investor.findById(id)
    } else {
      // Fallback for string-based IDs (garbage data)
      investor = await Investor.findOne({ _id: id }).collation({ locale: 'simple' }) || null
      // Note: Mongoose might usually throw calling findOne on bad ID too if strict.
      // If it fails, catch block usually handles it, but let's be careful.
    }

    if (!investor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 })
    }

    return NextResponse.json(investor)
  } catch (error) {
    // If it's a CastError, it means ID format didn't match Schema, returns 404 effectively
    if (error.name === 'CastError') {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 })
    }
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/investors/[id] - Update an investor
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Investor ID" }, { status: 400 })
    }

    const investor = await Investor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })

    if (!investor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 })
    }

    return NextResponse.json(investor)
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Investor with this email already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/investors/[id] - Delete an investor
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    if (mongoose.Types.ObjectId.isValid(id)) {
      const investor = await Investor.findByIdAndDelete(id)
      if (!investor) {
        return NextResponse.json({ error: "Investor not found" }, { status: 404 })
      }
    } else {
      // Force delete bad data (non-ObjectId) explicitly from the collection
      // adhering to how it might be stored as a string
      const result = await Investor.collection.deleteOne({ _id: id })
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Investor not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ message: "Investor deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}