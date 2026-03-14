"use client";
import { UpdateEditor } from "@/components/Editor";
import { useEditorContext } from "@/context/EditorContext";
import { getDataPostForEdit } from "@/lib/api";
import {
  editorLexicalJsonApi,
  editorLexicaltoHtmlPublish,
  editorPostSeoSaveAndCatagories,
} from "@/lib/editorApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CatagoriesListData } from "@/lib/constants";

export default function PostPage() {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState(null);
  const { lexicalJson, setLexicalJson } = useEditorContext();
  const [excerpt, setExcerpt] = useState(null);
  const [metaDescription, setMetaDescription] = useState(null);
  const [metaKeywords, setMetaKeywords] = useState(null);
  const [published, setPublished] = useState(null);
  const [author, setAuthor] = useState(null);
  const [postCatogories, setpostCatogories] = useState([]);

  useEffect(() => {
    const post = getDataForEdit();
  }, []);

  const getDataForEdit = async () => {
    const res = await getDataPostForEdit(post_id);
    console.log(res);
    setPost(res);
    setTitle(res.title);
    setExcerpt(res.excerpt);
    setMetaDescription(res.meta_description);
    setMetaKeywords(res.meta_keywords);
    setPublished(res.published);
    setLexicalJson(res.lexical_content);
    setAuthor(res.author);
    setpostCatogories(res?.categories);
  };

  const updateAndSavePost = async () => {
    console.log(title);
    console.log(lexicalJson);
    const res = await editorLexicalJsonApi({
      lexicalJsonData: lexicalJson,
      post_id,
    });
    console.log(res);
  };

  const publishTheSavedPost = async () => {
    const res = await editorLexicaltoHtmlPublish({
      lexicalJsonData: lexicalJson,
      post_id,
    });
    console.log(res);
  };

  const handleChangeExcerpt = (e) => {
    setExcerpt(e.target.value);
    e.target.style.height = "auto"; // reset height
    e.target.style.height = e.target.scrollHeight + "px"; // set to content height
  };

  const handleChangeMetaDescription = (e) => {
    setMetaDescription(e.target.value);
    e.target.style.height = "auto"; // reset height
    e.target.style.height = e.target.scrollHeight + "px"; // set to content height
  };

  const handleChangeMetaKeyword = (e) => {
    setMetaKeywords(e.target.value);
    e.target.style.height = "auto"; // reset height
    e.target.style.height = e.target.scrollHeight + "px"; // set to content height
  };

  const toggleOption = (option) => {
    setpostCatogories((prev) =>
      prev.includes(option.id)
        ? prev.filter((id) => id !== option.id)
        : [...prev, option.id],
    );
  };

  const updateSeoContentOfThisPost = async () => {
    console.log(
      post_id,
      excerpt,
      metaDescription,
      metaKeywords,
      postCatogories,
    );
    const res = await editorPostSeoSaveAndCatagories({
      post_id: post_id,
      post_excerpt: excerpt,
      post_meta_description: metaDescription,
      post_meta_keyword: metaKeywords,
      post_catagories: postCatogories,
    });
    console.log(res);
  };

  if (!post) {
    return (
      <div>
        <h1>Post not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-around">
        <Link
          href="/myblogs"
          className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
        >
          ← Back
        </Link>

        <button
          onClick={() => updateAndSavePost()}
          className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
        >
          Save
        </button>

        <button
          onClick={() => publishTheSavedPost()}
          className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
        >
          Save & Publish
        </button>
      </div>

      <input
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl"
        type="text"
        placeholder="type Title here"
        value={title}
      ></input>

      <div className="text-gray-600 mb-5">
        <p>
          By {author.name} • {new Date(post.created_at).toLocaleDateString()}
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

      <div className="space-y-10">
        <div className="block leading-8 whitespace-pre-wrap w-full max-w-4xl mx-auto min-h-80 overflow-scroll">
          {post.content}
          <UpdateEditor lexical_content={lexicalJson} />
        </div>

        <div className="w-64">
          {/* postCatogories Chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            {postCatogories.map((id) => {
              const category = CatagoriesListData.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                >
                  {category?.name}
                  <button
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => toggleOption(category)}
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>

          {/* Dropdown */}
          <ul className="mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {CatagoriesListData.map((option) => (
              <li
                key={option.id}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleOption(option)}
              >
                <input
                  type="checkbox"
                  checked={postCatogories.includes(option.id)}
                  readOnly
                  className="mr-2"
                />
                {option.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="block max-w-4xl mx-auto space-y-5">
          <p className="font-semibold">
            Excerpt :{" "}
            <span className="font-normal">(Reader-facing preview text)</span>
          </p>
          <textarea
            onChange={handleChangeExcerpt}
            className="border-2 border-black rounded-2xl p-5 w-full max-w-4xl resize-none overflow-hidden"
            placeholder="type excerpt here"
            value={excerpt}
          />
          <p className="font-semibold">
            Meta Description :{" "}
            <span className="font-normal">
              (Search engine-facing summary (shown in Google results))
            </span>
          </p>
          <textarea
            onChange={handleChangeMetaDescription}
            className="border-2 border-black rounded-2xl p-5 w-full max-w-4xl resize-none overflow-hidden"
            type="text"
            placeholder="type Meta Description here"
            value={metaDescription}
          />
          <p className="font-semibold">
            Meta Keyword :{" "}
            <span className="font-normal">
              (Mostly obsolete, but sometimes used in older SEO setups)
            </span>
          </p>
          <textarea
            onChange={handleChangeMetaKeyword}
            className="border-2 border-black rounded-2xl p-5 w-full max-w-4xl resize-none overflow-hidden pb-5"
            type="text"
            placeholder="type Meta Keywords here"
            value={metaKeywords}
          />
        </div>
        <button
          onClick={() => updateSeoContentOfThisPost()}
          className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
        >
          Save
        </button>
      </div>
    </div>
  );
}
