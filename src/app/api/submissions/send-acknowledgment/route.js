import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import { getAuthUser } from "@/lib/getAuthUser"
import { sendEmail } from "@/lib/sendEmail"

export async function POST(request) {
    try {
        await connectDB()
        const user = await getAuthUser()

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const { submissionId, participantEmail, participantName, subject, message } = await request.json()

        if (!participantEmail || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Create professional HTML email
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                .message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📧 Message from Hackathon Team</h1>
                </div>
                <div class="content">
                    <div class="message-box">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        If you have any questions, please don't hesitate to reach out.
                    </p>
                    <p>Best regards,<br>
                    <strong>Pushpak O2 Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent from the Hackathon Management System.</p>
                    <p>&copy; ${new Date().getFullYear()} Pushpak O2. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        try {
            await sendEmail({
                to: participantEmail,
                subject: subject,
                html: emailHtml
            });

            return NextResponse.json({ message: "Email sent successfully" });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
        }
    } catch (error) {
        console.error("Error sending acknowledgment:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
