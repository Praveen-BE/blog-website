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