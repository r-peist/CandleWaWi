"use client";
import { useEffect, useState } from "react";

export default function UserInfo() {
  interface Session {
    user: {
      name: string;
      email: string;
    };
    expires: string;
  }

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
    }

    fetchSession();
  }, []);

  if (!session) return <p>Lade Session-Daten...</p>;

  return (
    <div className="bg-white text-black mt-6 p-4 border rounded shadow w-full max-w-2xl">
      <h3 className="text-lg font-bold mb-2">Session-Debug</h3>
      <pre className="text-xs overflow-x-auto">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
