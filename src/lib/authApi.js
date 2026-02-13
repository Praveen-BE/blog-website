import "dotenv/config";

// console.log(process.env.NEXT_PUBLIC_API_URL);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function loginAPI({loginEmail, loginPassword}) {
  console.log(loginEmail, loginPassword);
try {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST', // important: specify POST
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword
    }),
    next: { revalidate: 60 }
  });

  if (!res.ok) throw new Error('Failed to login');
  return await res.json();
} catch (error) {
  console.error('Error logging in:', error);
  return [];
}
}

export async function logoutAPI() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) throw new Error('Failed to logout');

    // Remove token from browser storage
    localStorage.removeItem('token'); // or sessionStorage.removeItem('token')

    return null;
  } catch (error) {
    console.error('Error logging out:', error);
    return [];
  }
}


