'use client';
import { useRouter } from 'next/navigation';

export default async function Home() {
  const router = useRouter();


  const handleLogin = () => {
    // Call the Gmail auth API route
    router.push('/api/auth/gmail');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">AI Cold Email Tracker</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Sign in with Gmail
      </button>
    </main>
  );
}
