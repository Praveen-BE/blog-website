// ============================================
// FILE: components/PostCard.js
// Reusable component to display a post card
// ============================================

import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <div className="bg-white drop-shadow-sm border border-gray-300 p-5 mb-5 rounded-lg">
  <h2 className="mt-0 font-medium">
    <Link 
      href={`/posts/${post.id}`} 
      className="text-blue-500 no-underline"
    >
      {post.title}
    </Link>
  </h2>
  
  <p className="text-gray-600 text-sm">
    By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
  </p>
  
  <p>{post.excerpt || post.content.substring(0, 150) + '...'}</p>
  
  {post.categories && post.categories.length > 0 && (
    <div className="mt-2.5">
      {post.categories.map(cat => (
        <span 
          key={cat.id} 
          className="bg-gray-100 px-3 py-1 mr-2 rounded text-xs"
        >
          {cat.name}
        </span>
      ))}
    </div>
  )}
  
  <Link 
    href={`/posts/${post.id}`}
    className="inline-block mt-2.5 text-blue-500"
  >
    Read more →
  </Link>
</div>
  );
}




{/* <div style={{ 
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
    </div> */}