
'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import RecentBlogs from './RecentBlogs';
import NewsletterSignup from './NewsletterSignup';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import SharedBlogEditor from './SharedBlogEditor';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Pagination } from '@/components/ui/pagination';

export default function BlogsClient({ initialBlogs, totalCount: initialTotalCount, initialLimit }) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialTotalCount || 0);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { user } = useCurrentUser();
  const [showEditor, setShowEditor] = useState(false);

  // Define categories (you might want to fetch these from API too)
  const blogCategories = ['All', 'Technology', 'Industry', 'Safety', 'Business', 'Sustainability'];

  // Refresh blogs after create
  // Refresh blogs after create
  const handleBlogSuccess = () => {
    setShowEditor(false);
    // Ideally re-fetch or prepend new blog. For simplicity, reload page or fetch fresh.
    // Let's just reload for now to get fresh state including the new blog
    window.location.reload();
  };

  const handlePageChange = async (newPage) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?page=${newPage}&limit=${initialLimit}&published=true`);
      const data = await res.json();

      if (data.blogs) {
        setBlogs(data.blogs);
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Failed to load blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    return filtered;
  }, [blogs, searchQuery, activeCategory]);

  const recentBlogs = useMemo(() => {
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [blogs]);

  const popularBlogs = useMemo(() => {
    return [...blogs]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  }, [blogs]);

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      {/* Hero Section */}
      <motion.section
        className="py-8 md:py-12 bg-gradient-to-b from-blue-900/20 to-transparent relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our <motion.span
              className="text-blue-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Blog
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Insights from PushpakO2: The future of indigenous Indian aerospace, intelligent aerial systems, and advanced engineering from Bhopal to the world.
          </motion.p>
        </div>
      </motion.section>
      <section className='w-full flex justify-center items-center'>
        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEditor(true)}
            className="self-center cursor-pointer right-4 md:top-8 md:right-10 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors z-20"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Write Blog</span>
          </motion.button>
        )}
      </section>
      {/* Search and Filters */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <SearchBar onSearch={setSearchQuery} />

          <CategoryFilter
            categories={blogCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Blog Grid */}
            <div className="lg:col-span-3">
              {filteredBlogs.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredBlogs.map((blog, index) => (
                    <BlogCard key={blog._id} blog={blog} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-gray-400 mb-4">No blogs found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <motion.div
              className="space-y-6 lg:space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Only show recent/popular from loaded blogs or fetch specific widget data later. 
                  For MVP using loaded blogs is acceptable approximation or we could fetch purely recent/popular from API */}
              <RecentBlogs blogs={filteredBlogs} title="Recent Posts" />
              <RecentBlogs blogs={popularBlogs} title="Popular Posts" />

              {/* Newsletter Signup */}
              <motion.div
                className="bg-gray-800 rounded-xl p-4 md:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <NewsletterSignup />
              </motion.div>
            </motion.div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <Pagination
              currentPage={page}
              totalItems={totalCount}
              pageSize={initialLimit}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      {/* Full Screen Modal Editor */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-[#060B18]/95 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="w-full max-w-5xl">
              <SharedBlogEditor
                user={user}
                isModal={true}
                onCancel={() => setShowEditor(false)}
                onSuccess={handleBlogSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
