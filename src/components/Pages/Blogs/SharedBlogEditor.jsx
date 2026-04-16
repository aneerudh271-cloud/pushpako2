"use client";
import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function SharedBlogEditor({
    blog,
    onCancel,
    onSuccess,
    isModal = false,
    user // Pass session user
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: user?.name || "Anonymous",
        category: "Technology",
        tags: "",
        featuredImage: "",
        isPublished: true,
        isFeatured: false,
        readTime: 5,
    });

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

            // Backend overrides author/authorId, but we send what we have just in case.

            const url = blog ? `/api/blogs/${blog._id}` : "/api/blogs";
            const method = blog ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle 401/403 specifically
                if (res.status === 401) throw new Error("Please log in to perform this action");
                if (res.status === 403) throw new Error("You are not authorized to edit this blog");
                throw new Error(data.error || "Something went wrong");
            }

            toast.success(blog ? "Blog updated successfully" : "Blog created successfully");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`bg-gray-800 rounded-xl p-6 ${isModal ? 'max-h-[90vh] overflow-y-auto' : ''}`}>
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

                    {/* Slug - Read Only for regular users maybe? Or let them edit. Let's allow edit. */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="auto-generated-if-empty"
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

                    {/* Author - Read Only / Disabled since it's auto-set by auth */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Author</label>
                        <input
                            type="text"
                            name="author"
                            disabled
                            value={formData.author}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Tech, Innovation, Future"
                        />
                    </div>

                    {/* Read Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Read Time (min)
                        </label>
                        <input
                            type="number"
                            name="readTime"
                            min="1"
                            value={formData.readTime}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Featured Image */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                        Featured Image
                    </label>
                    <ImageUpload
                        value={formData.featuredImage}
                        onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                        disabled={loading}
                    />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Excerpt</label>
                    <textarea
                        name="excerpt"
                        required
                        rows="3"
                        value={formData.excerpt}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="Brief summary of the blog post..."
                    />
                </div>



                {/* Content */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                        Content
                    </label>
                    <RichTextEditor
                        key={blog ? blog._id : 'new'} // Force re-initialization when blog data changes or is present
                        content={formData.content}
                        onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                    />
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                        />
                        <span className="text-gray-300">Published</span>
                    </label>

                    {/* Only show Featured toggle for Admin? Or anyone? Let's leave for anyone for now unless spec says strict */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                        />
                        <span className="text-gray-300">Featured</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {blog ? "Update Blog" : "Create Blog"}
                    </button>
                </div>
            </form>
        </div>
    );
}
