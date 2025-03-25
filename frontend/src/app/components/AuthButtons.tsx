"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from '@auth0/nextjs-auth0/client';
export default function AuthButtons() {
    const { user, error, isLoading } = useUser();
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    if (isLoading) return <p>Laden...</p>;
    if (error) return <p>Fehler: {error.message}</p>;

    return user ? (
        <div>
            <p>Willkommen, {user.name}!</p>
            <a href="/api/auth/logout">Logout</a>
            {isAuthenticated ? (
                <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button>
            ) : (
                <button onClick={() => loginWithRedirect()}>Login</button>
            )}
        </div>
    ) : (
        <a href="/api/auth/login">Login</a>
    );
    
}
