// ============================================
// FILE: app/categories/page.js
// Category detail page - shows posts in a category
// Filter by Categories + Authors + Sort
// ============================================

// FILE: app/categories/page.js
import CategoryFilters from "@/components/CatagoryFilters";
import PostCard from "@/components/PostCard";

import { getPostsByFilter } from "@/lib/api";
import { CatagoriesListData } from "@/lib/constants";

export default async function HomePage({ searchParams }) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const sort = params.sort || "asc";
  const filter = params.filter;
  const author_ids = params.author_ids;

  // Normalize query params into arrays
  const filters = Array.isArray(filter) ? filter : filter ? [filter] : [];
  const authors = Array.isArray(author_ids) ? author_ids.map(Number) : author_ids ? [Number(author_ids)] : [];

  const postsResponse = await getPostsByFilter({
    slugs: filters,
    authorIds: authors,
    sort,
    limit: 10,
    offset: 0,
  });

  const posts = postsResponse?.posts || [];

  return (
    <div className="bg-blue-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Explore Content</h1>
        
        {/* Pass data to the Client Component */}
        <CategoryFilters 
          categories={CatagoriesListData}
          selectedFilters={filters}
          selectedAuthors={authors}
          sort={sort}
        />

        <hr className="my-8 border-gray-300" />

        <div className="grid gap-4">
          {posts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded shadow">
              <p className="text-gray-500 italic">No posts found matching these filters.</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}