// ============================================
// FILE: app/myblogs/page.js
// page.js display my blogs only 
// ============================================

"use client";

import PostCardUpdate from '@/components/PostCardUpdate';
import { getPostsMyBlogs } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const data = await getPostsMyBlogs(); // await the promise
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <div className="bg-blue-50">
      <h1>My Blogs</h1>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map(post => <PostCardUpdate key={post.id} post={post} />)
      )}
    </div>
  );
}


