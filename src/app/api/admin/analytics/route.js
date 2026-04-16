import { connectDB } from "@/lib/db/connectDB"
import Blog from "@/lib/models/Blog"
import User from "@/lib/models/User"
import Investor from "@/lib/models/Investor"
import Team from "@/lib/models/Team"
import PageView from "@/lib/models/PageView"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        await connectDB()

        // 1. Fetch Counts
        const [
            totalUsers,
            totalInvestors,
            totalTeam,
            blogStats,
            recentUsers,
            recentBlogs,
            pageStats,
            topPagesData
        ] = await Promise.all([
            User.countDocuments(),
            Investor.countDocuments(),
            Team.countDocuments(),
            Blog.aggregate([
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: "$views" },
                        totalPublished: { $sum: { $cond: ["$isPublished", 1, 0] } },
                        count: { $sum: 1 }
                    }
                }
            ]),
            User.find().sort({ createdAt: -1 }).limit(5).select('name email type createdAt'),
            Blog.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).select('title slug createdAt views'),
            PageView.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPageViews: { $sum: "$views" }
                    }
                }
            ]),
            PageView.find().sort({ views: -1 }).limit(10)
        ]);

        const stats = blogStats[0] || { totalViews: 0, totalPublished: 0, count: 0 };
        const totalPageViews = pageStats[0]?.totalPageViews || 0;

        // 2. Format Recent Activities
        const activities = [
            ...recentUsers.map(u => ({
                type: 'user',
                message: `New User: ${u.name} (${u.type})`,
                date: u.createdAt
            })),
            ...recentBlogs.map(b => ({
                type: 'blog',
                message: `Published Blog: ${b.title}`,
                date: b.createdAt
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        // 3. Format Top Pages
        const topPagesFormatted = topPagesData.map(p => ({
            page: p.path,
            title: p.path === '/' ? 'Homepage' : p.path, // Simple title fallback
            views: p.views
        }));

        // Return combined data
        return NextResponse.json({
            overview: {
                totalUsers,
                totalInvestors,
                totalTeam,
                totalBlogs: stats.count,
                totalPublishedBlogs: stats.totalPublished,
                totalViews: totalPageViews > 0 ? totalPageViews : stats.totalViews // Prefer PageView data if available
            },
            traffic: {
                pageViews: totalPageViews,
                topPages: topPagesFormatted
            },
            recentActivities: activities
        })

    } catch (error) {
        console.error("Analytics API Error:", error)
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }
}

