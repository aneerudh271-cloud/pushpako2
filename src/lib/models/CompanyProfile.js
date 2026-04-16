import mongoose from "mongoose"

const MissionItemSchema = new mongoose.Schema({
    id: String,
    text: String,
})

const PhilosophyItemSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
})

const DomainItemSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    items: [String],
    icon: String,
})

const MakeInIndiaSchema = new mongoose.Schema({
    title: String,
    description: String,
    points: [String],
})

const RegulatoryComplianceSchema = new mongoose.Schema({
    title: String,
    description: String,
    standards: [String],
})

const CompanyProfileSchema = new mongoose.Schema(
    {
        companyName: { type: String, default: "PushpakO2 Private Initiative" },
        brandName: { type: String, default: "PushpakO2" },
        tagline: { type: String, default: "Redefining the Future of Indian Aviation & Aerospace Systems" },
        about: { type: String },
        vision: { type: String },
        mission: [String],
        corePhilosophy: [PhilosophyItemSchema],
        keyDomains: [DomainItemSchema],
        technologyCapabilities: [String],
        makeInIndiaCommitment: MakeInIndiaSchema,
        regulatoryCompliance: RegulatoryComplianceSchema,
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export default mongoose.models.CompanyProfile || mongoose.model("CompanyProfile", CompanyProfileSchema)
