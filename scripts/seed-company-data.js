/**
 * Database Seed Script for PushpakO2 Company Profile Data
 * 
 * This script populates the database with the company profile data.
 * Run with: node scripts/seed-company-data.js
 * 
 * Make sure to set MONGODB_URI in your .env.local file
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define MONGODB_URI in .env.local');
    process.exit(1);
}

// Import company data
import {
    companyProfile,
    leadershipTeam,
    aboutUsPageData
} from '../src/lib/data/companyData.js';

// Define schemas inline for the script
const ValueSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    icon: String,
});

const PhilosophySchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
});

const DomainSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    items: [String],
    icon: String,
});

const StatSchema = new mongoose.Schema({
    id: String,
    label: String,
    value: String,
    suffix: String,
});

const AboutUsSchema = new mongoose.Schema(
    {
        companyName: { type: String, default: "PushpakO2 Private Initiative" },
        brandName: { type: String, default: "PushpakO2" },
        tagline: { type: String, default: "Redefining the Future of Indian Aviation & Aerospace Systems" },
        hero: {
            id: { type: String, default: "hero" },
            title: String,
            subtitle: String,
            description: String,
            backgroundImage: String,
            ctaText: String,
            ctaLink: String,
        },
        vision: {
            id: { type: String, default: "vision" },
            title: String,
            content: String,
            extendedContent: String,
            image: String,
        },
        mission: {
            id: { type: String, default: "mission" },
            title: String,
            items: [String],
        },
        values: [ValueSchema],
        corePhilosophy: [PhilosophySchema],
        keyDomains: [DomainSchema],
        technologyCapabilities: [String],
        makeInIndiaCommitment: {
            title: String,
            description: String,
            points: [String],
        },
        regulatoryCompliance: {
            title: String,
            description: String,
            standards: [String],
        },
        stats: [StatSchema],
    },
    { timestamps: true }
);

const TeamSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        bio: { type: String, required: true },
        fullBio: String,
        image: String,
        email: String,
        linkedin: String,
        twitter: String,
        github: String,
        department: {
            type: String,
            enum: ["Executive", "Technology", "Engineering", "Operations", "Safety", "Marketing", "Sales"],
            required: true
        },
        responsibilities: [String],
        joinDate: String,
        location: String,
        skills: [String],
        achievements: [String],
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const AboutUs = mongoose.models.AboutUs || mongoose.model('AboutUs', AboutUsSchema);
const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Seed About Us data
        console.log('\nSeeding About Us data...');

        const existingAboutUs = await AboutUs.findOne();

        const aboutUsData = {
            companyName: companyProfile.companyName,
            brandName: companyProfile.brandName,
            tagline: companyProfile.tagline,
            hero: aboutUsPageData.hero,
            vision: aboutUsPageData.vision,
            mission: {
                id: "mission",
                title: "Our Mission",
                items: companyProfile.mission,
            },
            values: aboutUsPageData.values,
            corePhilosophy: aboutUsPageData.corePhilosophy,
            keyDomains: companyProfile.keyDomains,
            technologyCapabilities: companyProfile.technologyCapabilities,
            makeInIndiaCommitment: companyProfile.makeInIndiaCommitment,
            regulatoryCompliance: companyProfile.regulatoryCompliance,
            stats: aboutUsPageData.stats,
        };

        if (existingAboutUs) {
            await AboutUs.findByIdAndUpdate(existingAboutUs._id, aboutUsData);
            console.log('Updated existing About Us data');
        } else {
            await AboutUs.create(aboutUsData);
            console.log('Created new About Us data');
        }

        // Seed Team data
        console.log('\nSeeding Team data...');

        for (const member of leadershipTeam) {
            const existingMember = await Team.findOne({ email: member.email });

            const teamData = {
                name: member.name,
                role: member.role,
                bio: member.bio,
                fullBio: member.fullBio,
                image: member.image,
                email: member.email,
                linkedin: member.linkedin,
                twitter: member.twitter,
                department: member.department,
                responsibilities: member.responsibilities,
                joinDate: new Date().toISOString().split('T')[0],
                isActive: member.isActive,
                order: member.order,
            };

            if (existingMember) {
                await Team.findByIdAndUpdate(existingMember._id, teamData);
                console.log(`Updated team member: ${member.name}`);
            } else {
                await Team.create(teamData);
                console.log(`Created team member: ${member.name}`);
            }
        }

        console.log('\n✅ Database seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedDatabase();
