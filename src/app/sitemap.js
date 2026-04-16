import { connectDB } from "@/lib/db/connectDB";
import Blog from "@/lib/models/Blog";
import Hackathon from "@/lib/models/Hackathon";
import { SEO_CONFIG } from "@/lib/seo-config";

export default async function sitemap() {
    const baseUrl = SEO_CONFIG.siteUrl; // Use the single source of truth

    // Static routes
    const routes = [
        '',
        '/about-us',
        '/our-team',
        '/services',
        '/technologies',
        '/blogs',
        '/contact-us',
        '/sign-in',
        '/privacy-policy',
        '/terms-condition',
        '/hackathons',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (Blogs)
    let blogRoutes = [];
    let hackathonRoutes = [];
    try {
        await connectDB();

        // Blogs
        const blogs = await Blog.find({ isPublished: true }).select('slug updatedAt').lean();
        blogRoutes = blogs.map((blog) => ({
            url: `${baseUrl}/blogs/${blog.slug}`,
            lastModified: blog.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        // Hackathons
        const hackathons = await Hackathon.find({ isPublished: { $ne: false } }).select('slug updatedAt createdAt status').lean();
        hackathonRoutes = hackathons.map((hackathon) => ({
            url: `${baseUrl}/hackathons/${hackathon.slug}`,
            lastModified: new Date(hackathon.updatedAt || hackathon.createdAt),
            changeFrequency: hackathon.status === 'LIVE' ? 'hourly' : 'daily',
            priority: hackathon.status === 'LIVE' ? 0.95 : 0.8,
        }));

    } catch (error) {
        console.error("Sitemap generation error:", error);
    }

    return [...routes, ...blogRoutes, ...hackathonRoutes];
}

