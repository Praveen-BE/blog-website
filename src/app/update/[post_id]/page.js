"use client";
import { UpdateEditor } from '@/components/Editor';
import { useEditorContext } from '@/context/EditorContext';
import { getDataPostForEdit } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function PostPage() {
  const {post_id} = useParams();
  const [post, setPost] = useState(null);
  const {lexicalJson, setLexicalJson} = useEditorContext();

  useEffect(()=>{
    const post = getDataForEdit();
  },[]);

  const getDataForEdit = async ()=>{
    const res = await getDataPostForEdit(post_id);
    setPost(res);
    setLexicalJson(res.lexical_content);
  }

  const updateAndSavePost = ()=>{
    console.log(lexicalJson);
  }
  
  if (!post) {
    return <div><h1>Post not found</h1></div>;
  }
  
  return (
  <article>
    <div className='flex justify-around'>
  <Link
    href="/myblogs"
    className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
  >
    ← Back
  </Link>

  <button
    onClick={()=>updateAndSavePost()}
    className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
  >
    Save
  </button>

  
  <button
    onClick={()=>publishTheSavedPost()}
    className="inline-block mt-5 mb-5 font-bold text-white bg-blue-700 p-3 rounded-2xl"
  >
    Save & Publish
  </button>
</div>
  
  <h1 className='text-xl'>{post.title}</h1>

  <div className="text-gray-600 mb-5">
    <p>
      By {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
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

  <div className="leading-8 whitespace-pre-wrap w-full max-w-4xl mx-auto h-fit">
    {/* {post.content} */}
     <UpdateEditor lexical_content={lexicalJson}/>
  </div>


 
</article>
  );
}