"use client";

// FILE: components/ReportButton.jsx
// Usage:
//   <ReportButton targetType="post"    targetId={postId} />
//   <ReportButton targetType="comment" targetId={commentId} />

import { useState } from "react";

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or hate speech" },
  { value: "misinformation", label: "Misinformation" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "copyright", label: "Copyright violation" },
  { value: "other", label: "Other" },
];

export default function ReportButton({ targetType, targetId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | duplicate
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason) return;

    setStatus("loading");

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send auth cookie
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          reason,
          details: details.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage("You've already reported this content.");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setStatus("success");
      setMessage("Thank you — your report has been submitted.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  function handleClose() {
    setOpen(false);
    // Reset after short delay so closing animation isn't jarring
    setTimeout(() => {
      setStatus("idle");
      setReason("");
      setDetails("");
      setMessage("");
    }, 300);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Report this ${targetType}`}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        ⚑ Report
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Report {targetType}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Success / duplicate / error states */}
            {status === "success" ||
            status === "duplicate" ||
            status === "error" ? (
              <div
                className={`rounded-lg p-4 text-sm ${
                  status === "success"
                    ? "bg-green-50 text-green-800"
                    : status === "duplicate"
                      ? "bg-yellow-50 text-yellow-800"
                      : "bg-red-50 text-red-800"
                }`}
              >
                {message}
                <button
                  onClick={handleClose}
                  className="block mt-3 text-xs underline opacity-70 hover:opacity-100"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a reason…</option>
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional details{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Describe the issue…"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-0.5 text-right">
                    {details.length}/500
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!reason || status === "loading"}
                    className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Submitting…" : "Submit report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
