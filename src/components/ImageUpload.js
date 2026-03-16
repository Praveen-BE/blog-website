"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function ImageUpload({ onUpload }) {
  const { post_id } = useParams();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); // New state

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      console.log("is Upload hit in frontend");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("postId", post_id);

      const res = await fetch("http://localhost:5000/api/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      onUpload(data?.url);
      setFile(null); // Clear file after success
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-sm"
      />
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded-md disabled:bg-gray-400"
        onClick={() => handleUpload()}
        disabled={!file || uploading}
      >
        {uploading ? "..." : "Upload"}
      </button>
    </div>
  );
}
