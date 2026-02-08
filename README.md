This is my blog website development repository

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
if port already run
npx kill-port 3000

This code is given by claude ai

```bash

// ============================================
// FILE: lib/api.js
// API helper functions to connect with backend
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getPosts(published = true) {
  try {
    const res = await fetch(`${API_URL}/posts${published ? '?published=true' : ''}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id) {
  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getPostsByCategory(slug) {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}/posts`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch posts by category');
    return res.json();
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

export async function getUserById(id) {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}


// ============================================
// FILE: components/PostCard.js
// Reusable component to display a post card
// ============================================

import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      marginBottom: '20px',
      borderRadius: '8px'
    }}>
      <h2 style={{ marginTop: 0 }}>
        <Link href={`/posts/${post.id}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
          {post.title}
        </Link>
      </h2>
      
      <p style={{ color: '#666', fontSize: '14px' }}>
        By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
      </p>
      
      <p>{post.excerpt || post.content.substring(0, 150) + '...'}</p>
      
      {post.categories && post.categories.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {post.categories.map(cat => (
            <span 
              key={cat.id} 
              style={{ 
                background: '#f0f0f0', 
                padding: '4px 12px', 
                marginRight: '8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}
      
      <Link 
        href={`/posts/${post.id}`}
        style={{ 
          display: 'inline-block',
          marginTop: '10px',
          color: '#0070f3'
        }}
      >
        Read more →
      </Link>
    </div>
  );
}


// ============================================
// FILE: components/Header.js
// Navigation header component
// ============================================

import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      background: '#333', 
      color: 'white', 
      padding: '20px',
      marginBottom: '30px'
    }}>
      <nav style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          My Blog
        </Link>
        <span style={{ marginLeft: '30px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            Home
          </Link>
          <Link href="/categories" style={{ color: 'white', textDecoration: 'none' }}>
            Categories
          </Link>
        </span>
      </nav>
    </header>
  );
}


// ============================================
// FILE: app/layout.js
// Root layout for all pages
// ============================================

import Header from '../components/Header';

export const metadata = {
  title: 'My Blog',
  description: 'A blog built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <Header />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}


// ============================================
// FILE: app/page.js
// Home page - displays all published posts
// ============================================

import { getPosts } from '../lib/api';
import PostCard from '../components/PostCard';

export default async function HomePage() {
  const posts = await getPosts(true); // Get only published posts
  
  return (
    <div>
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


// ============================================
// FILE: app/posts/[id]/page.js
// Single post page - displays full post content
// Dynamic route: /posts/1, /posts/2, etc.
// ============================================

import { getPostById } from '../../../lib/api';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const post = await getPostById(params.id);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }
  
  return {
    title: post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
  };
}

export default async function PostPage({ params }) {
  const post = await getPostById(params.id);
  
  if (!post) {
    return <div><h1>Post not found</h1></div>;
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      
      <div style={{ color: '#666', marginBottom: '20px' }}>
        <p>
          By {post.author_name} • 
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        
        {post.categories && post.categories.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {post.categories.map(cat => (
              <Link 
                key={cat.id}
                href={`/categories/${cat.slug}`}
                style={{ 
                  background: '#f0f0f0', 
                  padding: '4px 12px', 
                  marginRight: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  textDecoration: 'none',
                  color: '#333'
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ 
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap'
      }}>
        {post.content}
      </div>
      
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
        <h3>About the Author</h3>
        <p><strong>{post.author_name}</strong></p>
        {post.author_bio && <p>{post.author_bio}</p>}
      </div>
      
      <Link href="/" style={{ display: 'inline-block', marginTop: '20px', color: '#0070f3' }}>
        ← Back to all posts
      </Link>
    </article>
  );
}


// ============================================
// FILE: app/categories/page.js
// Categories listing page
// ============================================

import { getCategories } from '../../lib/api';
import Link from 'next/link';

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div>
      <h1>Categories</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            style={{ 
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333'
            }}
          >
            <h2 style={{ marginTop: 0 }}>{category.name}</h2>
            <p style={{ color: '#666' }}>{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


// ============================================
// FILE: app/categories/[slug]/page.js
// Category detail page - shows posts in a category
// Dynamic route: /categories/nodejs, /categories/react, etc.
// ============================================

import { getPostsByCategory } from '../../../lib/api';
import PostCard from '../../../components/PostCard';

export default async function CategoryPage({ params }) {
  const data = await getPostsByCategory(params.slug);
  
  if (!data || !data.category) {
    return <div><h1>Category not found</h1></div>;
  }
  
  const { category, posts } = data;
  
  return (
    <div>
      <h1>{category.name}</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>{category.description}</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Posts in this category ({posts.length})</h2>
        
        {posts.length === 0 ? (
          <p>No posts in this category yet.</p>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}


// ============================================
// FILE: .env.local
// Environment variables (create this file in root)
// ============================================

// NEXT_PUBLIC_API_URL=http://localhost:3001/api


// ============================================
// BACKEND API ENDPOINTS YOU NEED TO CREATE
// ============================================

/*
Your backend should have these endpoints:

1. GET /api/posts?published=true
   - Returns array of posts with author info and categories
   - Example response:
   [
     {
       id: 1,
       title: "Post Title",
       content: "...",
       excerpt: "...",
       author_id: 1,
       author_name: "John Doe",
       author_bio: "...",
       created_at: "2024-01-01T00:00:00Z",
       categories: [
         { id: 1, name: "Technology", slug: "technology" }
       ]
     }
   ]

2. GET /api/posts/:id
   - Returns single post with full details
   - Include JOIN with users table and categories

3. GET /api/categories
   - Returns all categories
   - Example: [{ id: 1, name: "Tech", slug: "tech", description: "..." }]

4. GET /api/categories/:slug/posts
   - Returns category info and its posts
   - Example: { category: {...}, posts: [...] }

5. GET /api/users/:id
   - Returns user info and their posts (optional)

Example Express.js backend route:

app.get('/api/posts', async (req, res) => {
  const { published } = req.query;
  const query = `
    SELECT 
      p.*,
      u.name as author_name,
      u.bio as author_bio,
      json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) as categories
    FROM posts p
    JOIN users u ON p.author_id = u.id
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.published = $1
    GROUP BY p.id, u.name, u.bio
    ORDER BY p.created_at DESC
  `;
  
  const result = await pool.query(query, [published === 'true']);
  res.json(result.rows);
});
*/

```