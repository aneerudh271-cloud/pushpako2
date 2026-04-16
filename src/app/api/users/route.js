import { connectDB } from "@/lib/db/connectDB"
import User from "@/lib/models/User"
import Contact from "@/lib/models/Contact"
import { NextResponse } from "next/server"

// Helper function to map Contact to User format
function mapContactToUser(contact) {
  return {
    _id: contact._id,
    name: contact.name,
    email: contact.email,
    phone: null, // Contacts don't have phone
    type: 'inquiry', // Map contacts to inquiry type
    source: 'Contact Us', // Map all contacts to "Contact Us" source
    message: contact.message,
    status: contact.status || 'new',
    tags: [], // Contacts don't have tags
    followUpDate: null, // Contacts don't have follow-up dates
    assignedTo: 'admin',
    notes: contact.subject ? `Subject: ${contact.subject}` : null,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
    // Add a flag to identify this as a contact record
    __isContact: true
  }
}

// GET /api/users - Get all users/contacts with optional filtering, search, and sorting
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const dataSource = searchParams.get('dataSource') || 'users' // 'users' or 'contacts' or 'all'

    let users = []
    let contacts = []

    // Fetch users if requested
    if (dataSource === 'users' || dataSource === 'all') {
      let userQuery = {}

      if (type && type !== 'all') {
        userQuery.type = type
      }

      if (status && status !== 'all') {
        userQuery.status = status
      }

      if (source && source !== 'all') {
        userQuery.source = source
      }

      // Add search functionality for users
      if (search) {
        userQuery.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } },
          { source: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } }
        ]
      }

      // Build sort object
      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

      users = await User.find(userQuery).sort(sortOptions)
    }

    // Fetch contacts if requested
    if (dataSource === 'contacts' || dataSource === 'all') {
      let contactQuery = {}

      // Map user filters to contact fields
      if (status && status !== 'all') {
        contactQuery.status = status
      }

      if (source && source !== 'all') {
        contactQuery.source = source
      }

      // Add search functionality for contacts
      if (search) {
        contactQuery.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
          { source: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } }
        ]
      }

      // Build sort object for contacts
      const sortOptions = {}
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

      const rawContacts = await Contact.find(contactQuery).sort(sortOptions)
      contacts = rawContacts.map(mapContactToUser)
    }

    // Combine and sort results
    const allRecords = [...users, ...contacts]

    // Apply final sorting if combining both data sources
    if (dataSource === 'all') {
      allRecords.sort((a, b) => {
        const aValue = new Date(a[sortBy])
        const bValue = new Date(b[sortBy])
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      })
    }

    return NextResponse.json(allRecords)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/users - Create a new user/lead
export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()

    // Check for duplicate email for subscribers
    if (data.type === 'subscriber' && data.email) {
      const existingSubscriber = await User.findOne({
        email: data.email,
        type: 'subscriber'
      })

      if (existingSubscriber) {
        return NextResponse.json({
          error: "This email is already subscribed to our newsletter"
        }, { status: 400 })
      }
    }

    const user = await User.create(data)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error(error)

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({
        error: "This email is already registered"
      }, { status: 400 })
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}