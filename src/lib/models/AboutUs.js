import mongoose from "mongoose"

const ValueSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  icon: String,
})

const PhilosophySchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
})

const MissionItemSchema = new mongoose.Schema({
  id: String,
  text: String,
})

const SocialLinkSchema = new mongoose.Schema({
  platform: String,
  url: String,
  icon: String,
})

const FooterLinkSchema = new mongoose.Schema({
  title: String,
  url: String,
  lastUpdated: String,
})

const CompanyInfoSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  phone: String,
})

const FooterSchema = new mongoose.Schema({
  socialLinks: [SocialLinkSchema],
  privacyPolicy: FooterLinkSchema,
  faq: FooterLinkSchema,
  support: FooterLinkSchema,
  roadmap: FooterLinkSchema,
  companyInfo: CompanyInfoSchema,
})

const StatSchema = new mongoose.Schema({
  id: String,
  label: String,
  value: String,
  suffix: String,
})

const DomainSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  items: [String],
  icon: String,
})

const AboutUsSchema = new mongoose.Schema(
  {
    // Company Basic Info
    companyName: { type: String, default: "PushpakO2 Private Initiative" },
    brandName: { type: String, default: "PushpakO2" },
    tagline: { type: String, default: "Redefining the Future of Indian Aviation & Aerospace Systems" },

    // Hero Section
    hero: {
      id: { type: String, default: "hero" },
      title: String,
      subtitle: String,
      description: String,
      backgroundImage: String,
      ctaText: String,
      ctaLink: String,
    },

    // Vision Section
    vision: {
      id: { type: String, default: "vision" },
      title: String,
      content: String,
      extendedContent: String,
      image: String,
    },

    // Mission Section
    mission: {
      id: { type: String, default: "mission" },
      title: String,
      items: [String],
    },

    // Core Values
    values: [ValueSchema],

    // Core Philosophy
    corePhilosophy: [PhilosophySchema],

    // Key Domains
    keyDomains: [DomainSchema],

    // Technology Capabilities
    technologyCapabilities: [String],

    // Make in India Commitment
    makeInIndiaCommitment: {
      title: String,
      description: String,
      points: [String],
    },

    // Regulatory Compliance
    regulatoryCompliance: {
      title: String,
      description: String,
      standards: [String],
    },

    // Footer
    footer: FooterSchema,

    // Stats
    stats: [StatSchema],
  },
  { timestamps: true }
)

export default mongoose.models.AboutUs || mongoose.model("AboutUs", AboutUsSchema)
