import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Hackathon from "@/lib/models/Hackathon"
import Investor from "@/lib/models/Investor" // Ensure model is registered for populate
import { getAuthUser } from "@/lib/getAuthUser"

export async function GET(request) {
    try {
        await connectDB()
        const user = await getAuthUser()

        let hackathons

        if (user && user.role === 'admin') {
            // Admin sees all hackathons
            hackathons = await Hackathon.find({}).populate('createdBy', 'name email').sort({ updatedAt: -1 })
        } else if (user && user.role === 'hackathon_manager') {
            // Manager sees ALL hackathons (Demo Adjustment: Allow managing all events)
            hackathons = await Hackathon.find({}).populate('createdBy', 'name email').sort({ updatedAt: -1 })
        } else if (user && user.role === 'investor') {
            // Investors see all hackathons (read-only)
            hackathons = await Hackathon.find({}).populate('createdBy', 'name email').sort({ updatedAt: -1 })
        } else {
            // Public visitors and standard users see only published hackathons
            hackathons = await Hackathon.find({ isPublished: { $ne: false } }).populate('createdBy', 'name email').sort({ updatedAt: -1 })
        }

        return NextResponse.json({ hackathons })
    } catch (error) {
        console.error("Error fetching hackathons:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        await connectDB()
        const user = await getAuthUser()

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await request.json()
        const { title, slug, overview, description, bannerImage, logo, timeline, teamSettings, rules, eligibility, allowedTechnologies, prizes, judgingCriteria, resourceLinks, isPublished, organizedBy, venue, theme, registrationFee, structure } = body

        if (!title || !description || !timeline?.startDate || !timeline?.endDate || !timeline?.registrationDeadline || !timeline?.submissionDeadline) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        const hackathon = new Hackathon({
            title,
            slug: generatedSlug,
            overview,
            description,
            bannerImage,
            logo,
            timeline,
            teamSettings,
            rules,
            eligibility,
            allowedTechnologies,
            prizes,
            judgingCriteria,
            resourceLinks,
            isPublished: isPublished || false,
            organizedBy,
            venue,
            theme,
            registrationFee,
            structure,
            createdBy: user.id
        })

        await hackathon.save()

        return NextResponse.json({ hackathon }, { status: 201 })
    } catch (error) {
        console.error("Error creating hackathon:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}