import "dotenv/config";

// console.log(process.env.NEXT_PUBLIC_API_URL);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function editorLexicalJsonApi({lexicalJsonData, post_id}) {
//   console.log(lexicalJson, post_id);
try {
  const res = await fetch(`${API_URL}/editor/lexicalsave`, {
    method: 'POST', // important: specify POST
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: post_id,
        lexicalJson: lexicalJsonData,
    }),
  });

  if (!res.ok) throw new Error('Post Did not Update');
  return await res.json();
} catch (error) {
  console.error('Error logging in:', error);
  return [];
}
}

export async function editorLexicaltoHtmlPublish({lexicalJsonData, post_id}) {
//   console.log(lexicalJson, post_id);
try {
  const res = await fetch(`${API_URL}/editor/updateashtml`, {
    method: 'POST', // important: specify POST
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: post_id,
        lexicalJson: lexicalJsonData,
    }),
  });

  if (!res.ok) throw new Error('Post Did not Update');
  if(res.ok) {
    alert("Published");
  }
  return await res.json();
} catch (error) {
  console.error('Error logging in:', error);
  return [];
}
}