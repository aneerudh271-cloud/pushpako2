import dotenv from 'dotenv'

// Load environment variables first
dotenv.config({ path: '.env.local' })

import { connectDB } from "../src/lib/db/connectDB.js"
import Blog from "../src/lib/models/Blog.js"
import Service from "../src/lib/models/Service.js"
import Technology from "../src/lib/models/Technology.js"
import User from "../src/lib/models/User.js"
import Investor from "../src/lib/models/Investor.js"
import Team from "../src/lib/models/Team.js"
import AboutUs from "../src/lib/models/AboutUs.js"
import Roadmap from "../src/lib/models/Roadmap.js"

import { mockBlogs } from "../src/lib/mockBlogs.js"
import { mockServices } from "../src/lib/mockServices.js"
import { mockTechnologies } from "../src/lib/mockTechnologies.js"
import { mockUsers } from "../src/lib/mockUsers.js"
import { mockInvestors } from "../src/lib/mockInvestors.js"
import { mockTeam } from "../src/lib/mockTeam.js"
import { mockAboutUs, mockRoadmap } from "../src/lib/mockAboutUs.js"

async function migrateData() {
  try {
    console.log("Connecting to database...")
    await connectDB()
    console.log("Connected successfully!")

    // Clear existing data (optional - remove in production)
    console.log("Clearing existing data...")
    await Promise.all([
      Blog.deleteMany({}),
      Service.deleteMany({}),
      Technology.deleteMany({}),
      User.deleteMany({}),
      Investor.deleteMany({}),
      Team.deleteMany({}),
      AboutUs.deleteMany({}),
      Roadmap.deleteMany({}),
    ])

    // Migrate blogs
    console.log("Migrating blogs...")
    const blogs = mockBlogs.map(blog => ({
      ...blog,
      publishedAt: new Date(blog.publishedAt),
      updatedAt: new Date(blog.updatedAt),
    }))
    await Blog.insertMany(blogs)
    console.log(`Migrated ${blogs.length} blogs`)

    // Migrate services
    console.log("Migrating services...")
    await Service.insertMany(mockServices)
    console.log(`Migrated ${mockServices.length} services`)

    // Migrate technologies
    console.log("Migrating technologies...")
    await Technology.insertMany(mockTechnologies)
    console.log(`Migrated ${mockTechnologies.length} technologies`)

    // Migrate users
    console.log("Migrating users...")
    const users = mockUsers.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      followUpDate: user.followUpDate ? new Date(user.followUpDate) : null,
    }))
    await User.insertMany(users)
    console.log(`Migrated ${users.length} users`)

    // Migrate investors
    console.log("Migrating investors...")
    await Investor.insertMany(mockInvestors)
    console.log(`Migrated ${mockInvestors.length} investors`)

    // Migrate team
    console.log("Migrating team...")
    await Team.insertMany(mockTeam)
    console.log(`Migrated ${mockTeam.length} team members`)

    // Migrate about us
    console.log("Migrating about us content...")
    await AboutUs.create(mockAboutUs)
    console.log("Migrated about us content")

    // Migrate roadmap
    console.log("Migrating roadmap...")
    await Roadmap.insertMany(mockRoadmap)
    console.log(`Migrated ${mockRoadmap.length} roadmap items`)

    console.log("Data migration completed successfully!")
    process.exit(0)

  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrateData()