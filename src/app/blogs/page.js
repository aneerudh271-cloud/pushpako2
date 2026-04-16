import { connectDB } from "@/lib/db/connectDB";
import Blog from "@/lib/models/Blog";
import BlogsClient from "@/components/Pages/Blogs/Index";
import { generateMetadata, generateSchema } from "@/lib/seo-config";

export const dynamic = 'force-dynamic';

export const metadata = generateMetadata({
  title: "Aerospace & Aviation Insights | PushpakO2 Blog",
  description: "Stay updated with the latest in Indian aerospace, indigenous aviation platforms, AI in aerial systems, and unmanned drone technology.",
  keywords: ["Future of Indian Aerospace", "Indigenous Aviation", "Intelligent Aerial Systems", "AI in Aviation", "Sustainable Aviation"],
  path: "/blogs"
});

export default async function page() {
  let blogs = [];
  let blogSchema = {};


  try {
    await connectDB();
    const limit = 20;
    const page = 1;

    // Fetch blogs and total count parallelly
    const [blogsResult, totalResult] = await Promise.all([
      Blog.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .select('-content -comments') // Exclude heavy fields for list view
        .limit(limit)
        .lean(),
      Blog.countDocuments({ isPublished: true })
    ]);

    blogs = JSON.parse(JSON.stringify(blogsResult));

    // Generate ItemList Schema for Blogs
    const blogItems = blogs.map((blog, index) => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt || blog.title,
      "url": `https://pushpako2.com/blogs/${blog.slug || blog._id}`,
      "author": {
        "@type": "Organization",
        "name": "PushpakO2"
      }
    }));

    blogSchema = generateSchema('ItemList', {
      "itemListElement": blogItems
    });


    return (
      <div className="min-h-screen text-white bg-[#060B18]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
        <BlogsClient initialBlogs={blogs} totalCount={totalResult} initialLimit={limit} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return (
      <div className="min-h-screen text-white bg-[#060B18]">
        <BlogsClient initialBlogs={[]} totalCount={0} initialLimit={20} />
      </div>
    );
  }
}
