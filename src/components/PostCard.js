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