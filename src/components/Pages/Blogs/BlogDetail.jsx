'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2, User, Edit } from 'lucide-react';
import CommentsSection from './CommentsSection';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import SharedBlogEditor from './SharedBlogEditor';

export default function BlogDetail({ blog }) {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  // If editing, show the editor full screen
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 bg-[#060B18] overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <SharedBlogEditor
            user={user}
            blog={blog}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isAuthor = user?.id === blog.authorId;
  const isAdmin = user?.role === 'admin';
  const canEdit = isAuthor || isAdmin;


  return (
    <div className="min-h-screen bg-[#060B18] text-white mt-14">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#060B18]/95 backdrop-blur-sm sticky top-14 z-40">
        <div className="container mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
          <div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <div>
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-200">Back to Blogs</span>
            </Link>
          </div>

          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
            >
              <Edit className="w-4 h-4" />
              Edit Blog
            </button>
          )}
        </div>
      </div>

      <article className="container mx-auto px-6 lg:px-10 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-8">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                {blog.category}
              </span>
            </div>
            {blog.isFeatured && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-semibold rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-4 mb-10">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between border-y border-gray-800 py-6 mb-12">
            <div className="flex items-center gap-4">
              {/* Share Buttons */}
              <button onClick={handleShare} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition" title="Share">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition ${isLiked ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section - Render HTML Safely */}
        <div className="max-w-3xl mx-auto 
            [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:text-lg
            [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-10 [&_h1]:mb-6
            [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-100 [&_h2]:mt-10 [&_h2]:mb-6
            [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-200 [&_h3]:mt-8 [&_h3]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-gray-300 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-gray-300 [&_ol]:space-y-2
            [&_li]:pl-1
            [&_a]:text-blue-400 [&_a]:underline hover:[&_a]:text-blue-300
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-500/10 [&_blockquote]:py-2 [&_blockquote]:px-6 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-gray-200 [&_blockquote]:my-8
            [&_img]:rounded-2xl [&_img]:shadow-xl [&_img]:my-8 [&_img]:border [&_img]:border-gray-800 [&_img]:w-full
            [&_code]:text-blue-300 [&_code]:bg-blue-900/30 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm
            [&_pre]:bg-[#0F172A] [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_pre]:border [&_pre]:border-gray-800
            [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:shadow-lg [&_iframe]:mb-8
        ">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-gray-800">
          <CommentsSection blogId={blog._id} currentUser={user} />
        </div>

      </article>
    </div>
  );
}