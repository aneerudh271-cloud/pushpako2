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

// GET /api/users/[id] - Get a single user/contact by ID
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    // Try to find in User collection first
    let record = await User.findById(id)

    if (!record) {
      // If not found in User, try Contact collection
      const contact = await Contact.findById(id)
      if (contact) {
        record = mapContactToUser(contact)
      }
    }

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update a user/contact
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const data = await request.json()

    // Check if this is a contact record first
    const existingContact = await Contact.findById(id)

    if (existingContact) {
      // Update contact - map user fields back to contact fields
      const contactUpdate = {
        status: data.status,
        source: data.source
      }

      // Only update name/email if provided (these are core contact fields)
      if (data.name) contactUpdate.name = data.name
      if (data.email) contactUpdate.email = data.email

      // Store additional user fields in the message or as notes
      if (data.notes && data.notes.startsWith('Subject: ')) {
        // Extract subject from notes
        const subjectMatch = data.notes.match(/^Subject: (.+)/)
        if (subjectMatch) {
          contactUpdate.subject = subjectMatch[1]
        }
      }

      const updatedContact = await Contact.findByIdAndUpdate(id, contactUpdate, {
        new: true
      })

      if (!updatedContact) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 })
      }

      return NextResponse.json(mapContactToUser(updatedContact))
    } else {
      // Update user
      const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(user)
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete a user/contact
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    // Check if this is a contact record first
    const existingContact = await Contact.findById(id)

    if (existingContact) {
      // Delete from contacts collection
      const deletedContact = await Contact.findByIdAndDelete(id)

      if (!deletedContact) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "Contact deleted successfully" })
    } else {
      // Delete from users collection
      const user = await User.findByIdAndDelete(id)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "User deleted successfully" })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}