"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function UserInfo() {
    const { user } = useUser();
    const roles = user?.["https://your-app.com/roles"] || [];

    return (
        <div>
            <h2>Hallo, {user?.name}</h2>
            {roles.includes("Admin") ? (
                <p>Du bist ein Admin!</p>
            ) : (
                <p>Normale Benutzerrechte</p>
            )}
        </div>
    );
}
