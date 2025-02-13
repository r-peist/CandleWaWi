"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthButtons() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <p>Laden...</p>;
    if (error) return <p>Fehler: {error.message}</p>;

    return user ? (
        <div>
            <p>Willkommen, {user.name}!</p>
            <a href="/api/auth/logout">Logout</a>
        </div>
    ) : (
        <a href="/api/auth/login">Login</a>
    );
}
