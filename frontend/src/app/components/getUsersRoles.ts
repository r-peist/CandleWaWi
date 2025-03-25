"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { createAccessToken } from "./CreateAccsesToken";

type Role = {
    id: string;
    name: string;
    description: string;
};

export async function getUsersRoles(): Promise<Role[]> {
    const session = await getSession(); //  Läuft jetzt korrekt im Server-Kontext
    const user = session?.user;

    if (!user) {
        throw new Error("User not found");
    }

    const token = await createAccessToken(); //  Server-Funktion bleibt auf dem Server

    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.sub}/roles`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user roles");
    }

    return response.json();
}
