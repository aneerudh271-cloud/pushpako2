import mongoose from "mongoose"

const HackathonSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        overview: { type: String },
        description: { type: String, required: true },
        bannerImage: { type: String },
        logo: { type: String },
        timeline: {
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            registrationDeadline: { type: Date, required: true },
            submissionDeadline: { type: Date, required: true }
        },
        teamSettings: {
            teamType: { type: String, enum: ['SOLO', 'TEAM'], default: 'SOLO' },
            minTeamSize: { type: Number, default: 1 },
            maxTeamSize: { type: Number, default: 1 },
            requireGenderBalance: { type: Boolean, default: false },
            minMale: { type: Number, default: 0 },
            minFemale: { type: Number, default: 0 }
        },
        rules: [{ type: String }],
        eligibility: [{ type: String }],
        allowedTechnologies: [{ type: String }],
        prizes: {
            totalPrizePool: { type: Number },
            firstPrize: { type: Number },
            secondPrize: { type: Number },
            thirdPrize: { type: Number },
            additionalPrizes: [{ title: String, amount: Number }]
        },
        judgingCriteria: [{
            title: String,
            description: String,
            weight: Number
        }],
        resourceLinks: [{
            title: String,
            url: String,
            type: { type: String, enum: ['DOCUMENTATION', 'GITHUB', 'DESIGN', 'VIDEO', 'OTHER'], default: 'OTHER' }
        }],
        organizedBy: { type: String },
        venue: { type: String },
        theme: { type: String },
        registrationFee: { type: Number, default: 0 },
        structure: [{
            roundName: String,
            activities: [String],
            elimination: String,
            judgingCriteria: [{
                title: String,
                weight: Number
            }]
        }],
        status: {
            type: String,
            enum: ["UPCOMING", "LIVE", "ENDED"],
            default: "UPCOMING"
        },
        isPublished: { type: Boolean, default: true },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investor",
            required: true
        },
    },
    { timestamps: true }
)

// Add indexes
HackathonSchema.index({ status: 1 })
HackathonSchema.index({ createdBy: 1 })
HackathonSchema.index({ "timeline.start": 1 })
HackathonSchema.index({ "timeline.end": 1 })

export default mongoose.models.Hackathon || mongoose.model("Hackathon", HackathonSchema)