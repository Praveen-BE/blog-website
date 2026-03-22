// ============================================
// FILE: lib/api.js
// API helper functions to connect with backend
// ============================================
import "dotenv/config";

// console.log(process.env.NEXT_PUBLIC_API_URL);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getPosts({
  published: published,
  sort: sort,
  filter: filter,
}) {
  try {
    const res = await fetch(
      `${API_URL}/posts${published ? "?published=true" : ""}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostsByAuthorId(author_id) {
  try {
    const res = await fetch(`${API_URL}/posts/authorblogs/${author_id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostsMyBlogs() {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/myblogs`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    //  const data = await res.json();
    // console.log(data);
    if (!res.ok) throw new Error("Failed to fetch posts");

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostById(id) {
  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getDataPostForEdit(id) {
  try {
    const res = await fetch(`${API_URL}/editor/edit/${id}`, {
      credentials: "include",
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getPostByCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getPostsByCategory(slug) {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch posts by category");
    return res.json();
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

export async function getUserById(id) {
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getPostsByFilter({
  slugs: slugs,
  authorIds: authorIds,
  sort: sort,
  limit: limit,
  offset: offset,
}) {
  try {
    let queryParams = new URLSearchParams();
    if (slugs.length == 0 || authorIds.length == 0) return [];
    if (slugs.length > 0) queryParams.append("slugs", slugs.join(","));
    if (authorIds.length > 0)
      queryParams.append("author_ids", authorIds.join(","));
    if (sort) queryParams.append("sort", sort);
    queryParams.append("limit", limit);
    queryParams.append("offset", offset);

    console.log(queryParams.toString());

    const res = await fetch(
      `${API_URL}/posts/byfilter?${queryParams.toString()}`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { count: 0, posts: [] };
  }
}
