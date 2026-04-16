"use client";
import { useState, useEffect } from "react";
import { X, Save, Image as ImageIcon, Loader2, Wand2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function BlogEditor({ blog, onCancel, onSave }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Admin", // default
        category: "Technology",
        tags: "",
        featuredImage: "",
        isPublished: true,
        isFeatured: false,
        readTime: 5,
    });

    // AI Assistant State
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    const handleGenerateAI = async () => {
        if (!aiPrompt.trim()) {
            toast.error("Please enter a topic for the AI");
            return;
        }

        setAiLoading(true);
        try {
            const res = await fetch("/api/admin/ai-assist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt }),
            });

            const result = await res.json();

            if (result.success) {
                setFormData((prev) => ({
                    ...prev,
                    title: result.data.title,
                    content: result.data.content,
                    excerpt: result.data.excerpt,
                    slug: result.data.slug,
                    tags: result.data.tags,
                    featuredImage: result.data.featuredImage || prev.featuredImage, // Only overwrite if image found
                }));
                toast.success("✨ Magic! Blog content generated successfully.");
                // Optional: Scroll to form or highlight
            } else {
                toast.error(result.error || "Failed to generate content");
            }
        } catch (error) {
            console.error("AI Generation failed:", error);
            toast.error("Failed to connect to AI assistant");
        } finally {
            setAiLoading(false);
        }
    };

    const categories = [
        "Technology",
        "Industry",
        "Safety",
        "Business",
        "Sustainability",
        "Innovation",
    ];

    useEffect(() => {
        if (blog) {
            setFormData({
                ...blog,
                tags: blog.tags ? blog.tags.join(", ") : "",
            });
        }
    }, [blog]);

    // Auto-generate slug when title changes (only for new blogs or if slug is empty)
    useEffect(() => {
        if (!blog && formData.title) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, blog]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            };

            const url = blog ? `/api/blogs/${blog._id}` : "/api/blogs";
            const method = blog ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(blog ? "Blog updated successfully" : "Blog created successfully");
                onSave();
            } else {
                toast.error(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-xl font-bold text-white">
                    {blog ? "Edit Blog" : "Create New Blog"}
                </h2>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-700 rounded-lg transition"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* AI Assistant Section */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-24 h-24 text-blue-400" />
                </div>

                <h3 className="text-lg font-semibold text-blue-200 flex items-center gap-2 mb-3">
                    <Wand2 className="w-5 h-5" />
                    AI Magic Draft
                </h3>

                <p className="text-sm text-gray-400 mb-4">
                    Enter a topic or simple prompt, and our AI will generate a complete blog post with an SEO title, formatted content, and a relevant image from Unsplash.
                </p>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. The future of autonomous drones in agriculture..."
                        className="flex-1 bg-gray-900/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                    />
                    <button
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={aiLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                        {aiLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Draft
                            </>
                        )}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Blog Title"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Slug (Auto-generated)</label>
                        <input
                            type="text"
                            name="slug"
                            required
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="url-slug"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Author</label>
                        <input
                            type="text"
                            name="author"
                            required
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Technology, Innovation, Future"
                        />
                    </div>

                    {/* Read Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Read Time (min)</label>
                        <input
                            type="number"
                            name="readTime"
                            value={formData.readTime}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Excerpt</label>
                    <textarea
                        name="excerpt"
                        required
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="Brief summary of the blog post..."
                    />
                </div>

                {/* Featured Image */}
                <div className="space-y-2">
                    <ImageUpload
                        label="Featured Image"
                        value={formData.featuredImage}
                        onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                        required
                    />
                </div>

                {/* Content - Rich Text Editor */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Content</label>
                    <RichTextEditor
                        content={formData.content}
                        onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                    />
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
                        />
                        <span className="text-sm text-gray-300">Published</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
                        />
                        <span className="text-sm text-gray-300">Featured</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-300 hover:text-white transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Blog
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
