// FILE: components/CommentSection.jsx
"use client";

import { useState, useEffect } from "react";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments on mount
  useEffect(() => {
    fetch(`/api/comments/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load comments");
        setLoading(false);
      });
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends your auth cookie
        body: JSON.stringify({ content: newComment }),
      });

      if (res.status === 401) {
        setError("You must be logged in to comment.");
        return;
      }
      if (!res.ok) throw new Error();

      const saved = await res.json();
      // Optimistically add to list (we don't have user_name yet, refetch)
      const fullRes = await fetch(
        `http://localhost:5000/api/comments/${postId}`,
      );
      const updated = await fullRes.json();
      setComments(updated);
      setNewComment("");
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error();
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  return (
    <section className="mt-10 pt-6 border-t border-gray-300">
      <h3 className="text-lg font-bold mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="mt-2 px-5 py-2 bg-blue-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-sm">
                    {comment.user_name}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                {/* Show delete only for comment owner — 
                    pass currentUserId as prop if you have session */}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
