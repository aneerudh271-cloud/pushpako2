import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connectDB"
import Participation from "@/lib/models/Participation"
import Hackathon from "@/lib/models/Hackathon"
import Token from "@/lib/models/Token"
import { getAuthUser } from "@/lib/getAuthUser"
import { sendEmail } from "@/lib/sendEmail"
import crypto from 'crypto'

export async function PUT(request, { params }) {
    try {
        await connectDB()
        const user = await getAuthUser()
        const { id } = await params

        if (!user || (user.role !== 'admin' && user.role !== 'hackathon_manager')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const participation = await Participation.findById(id).populate('hackathon')

        if (!participation) {
            return NextResponse.json({ error: "Participation not found" }, { status: 404 })
        }

        // Check ownership
        /*
        if (user.role === 'hackathon_manager' && participation.hackathon.createdBy.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        */

        const { action } = await request.json()

        if (action === 'approve') {
            if (participation.status !== 'PENDING' && participation.status !== 'REGISTERED' && participation.status !== 'CODE_REQUESTED') {
                return NextResponse.json({ error: "Can only approve pending, registered or code-requested participations" }, { status: 400 })
            }

            participation.status = 'APPROVED'
            participation.approvedBy = user.id

            // Generate participation code
            const code = crypto.randomBytes(16).toString('hex')
            participation.participationCode = code
            await participation.save()

            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

            const token = new Token({
                participation: participation._id,
                code,
                expiresAt
            })

            await token.save()

            await token.save()

            // Don't return the code to the client on approval
            return NextResponse.json({ participation })
        } else if (action === 'reject') {
            participation.status = 'REJECTED'
            await participation.save()
            return NextResponse.json({ participation })
        } else if (action === 'send-token') {
            if (participation.status !== 'APPROVED') {
                return NextResponse.json({ error: "Participation must be approved first" }, { status: 400 })
            }

            // Real Email Sending
            const participantUser = await import("@/lib/models/HackathonUser").then(mod => mod.default.findById(participation.user));
            if (participantUser) {
                const emailHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .token-box { background: #000; color: #00ff00; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 18px; letter-spacing: 0.3em; text-align: center; margin: 20px 0; border: 2px solid #00ff00; }
                        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Congratulations!</h1>
                            <p>Your participation has been approved</p>
                        </div>
                        <div class="content">
                            <h2>Hello ${participantUser.name},</h2>
                            <p>Great news! Your participation in <strong>${participation.hackathon.title}</strong> has been approved by the hackathon manager.</p>
                            
                            <p>Here is your unique <strong>Access Token</strong> to submit your project:</p>
                            
                            <div class="token-box">
                                ${participation.participationCode}
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong> Keep this token secure and do not share it with anyone. You will need this token to submit your hackathon project.
                            </div>
                            
                            <p><strong>Next Steps:</strong></p>
                            <ol>
                                <li>Visit the hackathon details page</li>
                                <li>Click on "Submit Project"</li>
                                <li>Enter your Access Token in the form</li>
                                <li>Fill in your project details and submit</li>
                            </ol>
                            
                            <p style="text-align: center;">
                                <a href="${process.env.NEXTAUTH_URL}/hackathons" class="button">View Hackathon</a>
                            </p>
                            
                            <p>If you didn't register for this hackathon or have any questions, please contact our support team immediately.</p>
                            
                            <p>Best of luck with your project!<br>
                            <strong>Pushpak O2 Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this message.</p>
                            <p>&copy; ${new Date().getFullYear()} Pushpak O2. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

                try {
                    await sendEmail({
                        to: participantUser.email,
                        subject: `🎉 Access Token for ${participation.hackathon.title}`,
                        html: emailHtml
                    });

                    participation.tokenSent = true;
                    await participation.save();

                    return NextResponse.json({ message: "Access token sent to participant's email", participation });
                } catch (emailError) {
                    console.error('Email sending failed:', emailError);
                    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
                }
            } else {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 })
        }
    } catch (error) {
        console.error("Error updating participation:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}