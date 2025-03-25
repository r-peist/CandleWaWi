"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function LogoutButton() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Link
      href="/api/auth/logout"
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </Link>
  );
}
