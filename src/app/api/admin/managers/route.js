import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connectDB";
import Investor from "@/lib/models/Investor"; // Using Investor as the User model
import { getAuthUser } from "@/lib/getAuthUser";
import bcrypt from "bcryptjs";

export async function GET(request) {
    try {
        await connectDB();
        const authUser = await getAuthUser();

        // 1. Auth Check: Must be logged in and be an Admin
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 2. Fetch Managers
        const managers = await Investor.find({ role: 'hackathon_manager' })
            .select('-password') // Exclude password
            .sort({ createdAt: -1 });

        return NextResponse.json({ managers });
    } catch (error) {
        console.error("Error fetching managers:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const authUser = await getAuthUser();

        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
        }

        // 3. Check for duplicates
        const existingUser = await Investor.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // 4. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create Manager
        const newManager = await Investor.create({
            name,
            email,
            password: hashedPassword,
            role: 'hackathon_manager',
            status: 'active',
            isFirstLogin: true // Force password change optionally? But simplified for now.
        });

        return NextResponse.json({
            message: "Hackathon Manager created successfully",
            manager: {
                id: newManager._id,
                name: newManager.name,
                email: newManager.email,
                role: newManager.role
            }
        });

    } catch (error) {
        console.error("Error creating manager:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const authUser = await getAuthUser();

        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Manager ID required" }, { status: 400 });
        }

        await Investor.findByIdAndDelete(id);

        return NextResponse.json({ message: "Manager deleted successfully" });

    } catch (error) {
        console.error("Error deleting manager:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
