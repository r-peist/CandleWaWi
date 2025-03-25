"use client"; // Next.js Client Component

import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
            clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
            authorizationParams={{
                redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
                audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!,
            }}
            onRedirectCallback={() => router.push("/dashboard")}
        >
            <UserProvider>
                {children}
            </UserProvider>
        </Auth0Provider>
    );
}
