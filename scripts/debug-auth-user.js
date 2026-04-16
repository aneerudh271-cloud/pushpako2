
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import Investor from '../src/lib/models/Investor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define MONGODB_URI in .env.local');
    process.exit(1);
}

async function debugAuth() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('\n--- Checking Investors ---');
        const investors = await Investor.find({});
        console.log(`Found ${investors.length} investors/admins.`);

        // Force create a test admin user
        const testAdminEmail = 'testadmin@pushpako2.com';
        let testAdmin = await Investor.findOne({ email: testAdminEmail });
        
        if (!testAdmin) {
            console.log('Creating test admin user...');
            const adminPassword = 'admin123';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            
            testAdmin = new Investor({
                name: 'Test Admin',
                email: testAdminEmail,
                password: hashedPassword,
                role: 'admin',
                status: 'active',
                authProvider: 'email'
            });
            await testAdmin.save();
            console.log(`Created test admin: ${testAdminEmail} / ${adminPassword}`);
        } else {
             console.log('Test admin already exists. Resetting password...');
             const adminPassword = 'admin123';
             testAdmin.password = await bcrypt.hash(adminPassword, 10);
             testAdmin.role = 'admin'; // Ensure role is admin
             await testAdmin.save();
             console.log(`Reset password for: ${testAdminEmail} / ${adminPassword}`);
        }

        if (investors.length === 0) {
            console.log('No users found. Creating a default admin user...');
            const adminEmail = 'admin@pushpako2.com';
            const adminPassword = 'admin123'; // Default password
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const newAdmin = new Investor({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                status: 'active',
                authProvider: 'email'
            });

            await newAdmin.save();
            console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
        } else {
            for (const inv of investors) {
                console.log(`- ${inv.email} (Role: ${inv.role}, Status: ${inv.status}, Provider: ${inv.authProvider})`);
                if (inv.role === 'admin') {
                    console.log('  [INFO] Admin exists.');
                    // Verify a known password if you want, or just report existence
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

debugAuth();
