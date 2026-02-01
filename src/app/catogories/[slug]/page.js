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