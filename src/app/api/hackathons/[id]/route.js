import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Hackathon from "@/lib/models/Hackathon"
import Investor from "@/lib/models/Investor"
import { getAuthUser } from "@/lib/getAuthUser"

import mongoose from "mongoose"

export async function GET(request, { params }) {
    try {
        await connectDB()
        const { id } = await params

        let hackathon

        if (mongoose.Types.ObjectId.isValid(id)) {
            hackathon = await Hackathon.findById(id).populate('createdBy', 'name email')
        }

        if (!hackathon) {
            // Try finding by slug
            hackathon = await Hackathon.findOne({ slug: id }).populate('createdBy', 'name email')
        }

        if (!hackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
        }

        return NextResponse.json({ hackathon })
    } catch (error) {
        console.error("Error fetching hackathon:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB()
        const user = await getAuthUser()
        const { id } = await params

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const hackathon = await Hackathon.findById(id)

        if (!hackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
        }

        // Check ownership for managers
        /*
        if (user.role === 'hackathon_manager' && hackathon.createdBy.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        */

        const body = await request.json()
        const { title, slug, overview, description, bannerImage, logo, timeline, teamSettings, rules, eligibility, allowedTechnologies, prizes, judgingCriteria, resourceLinks, status, isPublished, organizedBy, venue, theme, registrationFee, structure } = body

        if (title) hackathon.title = title
        if (slug) hackathon.slug = slug
        if (overview !== undefined) hackathon.overview = overview
        if (description) hackathon.description = description
        if (bannerImage !== undefined) hackathon.bannerImage = bannerImage
        if (logo !== undefined) hackathon.logo = logo
        if (timeline) hackathon.timeline = timeline
        if (teamSettings) hackathon.teamSettings = teamSettings
        if (rules) hackathon.rules = rules
        if (eligibility) hackathon.eligibility = eligibility
        if (allowedTechnologies) hackathon.allowedTechnologies = allowedTechnologies
        if (prizes) hackathon.prizes = prizes
        if (judgingCriteria) hackathon.judgingCriteria = judgingCriteria
        if (resourceLinks) hackathon.resourceLinks = resourceLinks
        if (status) hackathon.status = status
        if (isPublished !== undefined) hackathon.isPublished = isPublished
        if (organizedBy !== undefined) hackathon.organizedBy = organizedBy
        if (venue !== undefined) hackathon.venue = venue
        if (theme !== undefined) hackathon.theme = theme
        if (registrationFee !== undefined) hackathon.registrationFee = registrationFee
        if (structure !== undefined) hackathon.structure = structure

        await hackathon.save()

        return NextResponse.json({ hackathon })
    } catch (error) {
        console.error("Error updating hackathon:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB()
        const user = await getAuthUser()
        const { id } = await params

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const hackathon = await Hackathon.findById(id)

        if (!hackathon) {
            return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
        }

        // Check ownership for managers
        /*
        if (user.role === 'hackathon_manager' && hackathon.createdBy.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        */

        await Hackathon.findByIdAndDelete(id)

        return NextResponse.json({ message: "Hackathon deleted successfully" })
    } catch (error) {
        console.error("Error deleting hackathon:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}