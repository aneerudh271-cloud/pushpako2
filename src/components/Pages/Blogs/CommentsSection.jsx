"use client";
import { useState, useEffect } from "react";
import { User, Send, Loader2, Trash2, Heart, MessageSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser"; // Updated hook
import { toast } from "react-hot-toast";

export default function CommentsSection({ blogId }) {
  const { user } = useCurrentUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data, ...prev]); // Prepend new comment
        setNewComment("");
        toast.success("Comment added!");
      } else {
        toast.error(data.error || "Failed to add comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments/${commentId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
        toast.success("Comment deleted");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  }

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        Comments <span className="text-blue-500 text-lg">({comments.length})</span>
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="relative">
          <div className="absolute top-4 left-4">
            {user ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="w-8 h-8 text-gray-500 bg-gray-800 rounded-full p-1.5" />
            )}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Write a comment..." : "Sign in to join the discussion..."}
            disabled={!user}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-4 pro-12 pl-16 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed resize-none min-h-[100px]"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {newComment.trim() && (
              <button
                type="submit"
                disabled={!user || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post
              </button>
            )}
          </div>
        </div>
        {!user && (
          <p className="text-sm text-gray-500 mt-3 ml-1">
            Please <a href="/sign-in" className="text-blue-400 hover:underline">sign in</a> to leave a comment.
          </p>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {fetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="group">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {comment.author?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{comment.author}</h4>
                          {comment.userId === user?.id && (
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">You</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-4 mt-2 ml-2">
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                    {(user?.role === 'admin' || user?.id === comment.userId) && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
            <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}