// ============================================
// FILE: app/posts/[id]/page.js
// Single post page - displays full post content
// Dynamic route: /posts/1, /posts/2, etc.
// ============================================

import CommentSection from "@/components/commentsSection";
import { getPostById } from "../../../lib/api";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return (
      <div>
        <h1>Post not found</h1>
      </div>
    );
  }

  return (
    <article>
      <h1 className="text-xl">{post.title}</h1>

      <div className="text-gray-600 mb-5">
        <p>
          By {post.author_name} •{" "}
          {new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.categories && post.categories.length > 0 && (
          <div className="mt-2.5">
            {post.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="bg-gray-100 px-3 py-1 mr-2 rounded text-xs no-underline text-gray-800"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="leading-8 whitespace-pre-wrap">
        <article
          className="lexical-content prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <div className="mt-10 pt-5 border-t border-gray-300">
        <h3>About the Author</h3>
        <p>
          <strong>{post.author_name}</strong>
        </p>
        {post.author_bio && <p>{post.author_bio}</p>}
      </div>

      <CommentSection postId={id} />

      <Link
        href="/"
        className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
      >
        ← Back to all posts
      </Link>
    </article>
  );
}
