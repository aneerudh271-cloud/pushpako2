'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export default function RecentBlogs({ blogs, title = "Recent Posts" }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-3 md:space-y-4">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog._id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          >
            <Link
              href={`/blogs/${blog.slug || blog._id}`}
              className="block group"
            >
              <motion.div
                className="flex gap-3 md:gap-4"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2 mb-1 text-sm md:text-base">
                    {blog.title}
                  </h4>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{blog.readTime} min</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}