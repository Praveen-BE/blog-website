"use client";

import Link from "next/link";
import { useRef } from "react";

export default function CategoryFilters({ categories, selectedFilters, authors, selectedAuthors, sort }) {
  const formRef = useRef(null);

  const handleSelectAll = (name) => {
    const checkboxes = formRef.current.querySelectorAll(`input[name='${name}']`);
    checkboxes.forEach((cb) => (cb.checked = true));
  };

  return (
    <form ref={formRef} method="get" className="space-y-4">
      <div className="dropdown">
        <button type="button" className="dropdown-btn font-bold">Filter by Category</button>
        <div className="my-2 w-full overflow-x-auto flex gap-2 pb-2">
          {categories.map((cata) => (
            <label key={cata.id} className="bg-gray-200 px-3 py-1 rounded-full cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                name="filter"
                value={cata.slug}
                defaultChecked={selectedFilters.includes(cata.slug)}
              />
              {cata.name}
            </label>
          ))}
        </div>
        <button 
          type="button" 
          onClick={() => handleSelectAll('filter')}
          className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition"
        >
          Select All Categories
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Authors:</span>
        <div className="flex gap-4">
          {[1, 2].map(id => (
            <label key={id} className="flex items-center gap-2">
              <input type="checkbox" name="author_ids" value={id} defaultChecked={selectedAuthors.includes(id)} />
              Author {id}
            </label>
          ))}
        </div>
        <button 
          type="button" 
          onClick={() => handleSelectAll('author_ids')}
          className="bg-green-600 text-white px-3 py-1 text-sm rounded self-start"
        >
          Select All Authors
        </button>
      </div>

      <div className="flex items-center gap-4">
        <select name="sort" defaultValue={sort} className="border p-1 rounded">
          <option value="asc">Sort Ascending</option>
          <option value="desc">Sort Descending</option>
        </select>
        
        <button type="submit" className="bg-blue-600 text-white px-6 py-1 rounded hover:bg-blue-700">
          Apply Filters
        </button>
        <a href="/catogories" className="bg-gray-400 text-white px-6 py-1 rounded">
          Reset
        </a>
      </div>
    </form>
  );
}