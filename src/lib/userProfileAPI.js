const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getUserProfileByToken() {
  try {
    // Get user data by using token
    // 👦dock dock , 👧Yaaru?, 👦Nandhan
    const res = await fetch(`${API_URL}/profile/nanthan`, {
            method: 'GET', // important: specify GET
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}