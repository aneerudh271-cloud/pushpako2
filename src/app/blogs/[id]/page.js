import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import BlogDetail from '@/components/Pages/Blogs/BlogDetail';

export const dynamic = 'force-dynamic';

import { connectDB } from "@/lib/db/connectDB";
import Blog from "@/lib/models/Blog";

async function getBlog(id) {
  try {
    await connectDB();

    // Try to fetch by slug first
    let blog = await Blog.findOne({ slug: id, isPublished: true }).lean();

    // If not found by slug, try by ID if it's a valid ObjectId
    if (!blog && /^[0-9a-fA-F]{24}$/.test(id)) {
      blog = await Blog.findOne({ _id: id, isPublished: true }).lean();
    }

    if (!blog) {
      return null;
    }

    // Deep clone to ensure all Mongoose objects (ObjectId, Date, etc.) are serialized to string
    // This fixes the "Only plain objects can be passed to Client Components" error
    blog = JSON.parse(JSON.stringify(blog));

    // Increment view count (fire and forget to avoid blocking)
    try {
      await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    } catch (err) {
      console.error('Error incrementing views:', err);
    }

    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return <BlogDetail blog={blog} />;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: 'Blog Not Found | Pushpak O2',
    };
  }

  return {
    title: `${blog.title} | Pushpak O2`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}