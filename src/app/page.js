// ============================================
// FILE: app/page.js
// Home page - displays all published posts
// ============================================

"use server";

import { getPosts } from '../lib/api';
import PostCard from '../components/PostCard';
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default async function HomePage({searchParams}) {

  const posts = await getPosts({published:true}); // Get only published posts
  
  return (
    <div className='bg-blue-50'>

      <h1>Latest Posts</h1>
      
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
}
