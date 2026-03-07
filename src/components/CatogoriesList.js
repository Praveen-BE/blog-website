// ============================================
// FILE: app/categories/page.js
// Categories listing page
// ============================================


import { getCategories } from '@/lib/api';
import Link from 'next/link';

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div>
      <h1>Categories</h1>
      
      <div className='grid grid-flow-col grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 overflow-x-auto'>
      {/* style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }} */}
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className='border border-solid rounded-md no-underline text-[#333333] px-3 py-3'
          >
            <h2 className='mt-0'>{category.name}</h2>
            <p className='text-[#666666] line-clamp-1'>{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}