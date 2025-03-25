"use server";

import axios from "axios";
import { AxiosError } from "axios";

interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export async function createAccessToken(): Promise<string> {
    try {
        const response = await axios.post<AccessTokenResponse>(
            `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.AUTH0_CLIENT_ID!,
                client_secret: process.env.AUTH0_CLIENT_SECRET!,
                audience: process.env.AUTH0_AUDIENCE!,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        console.log("Access Token erfolgreich erstellt:", response.data);
        return response.data.access_token;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error("Error creating access token:", axiosError.response?.data || axiosError.message);
        } else {
            console.error("Error creating access token:", error);
        }
        const axiosError = error as AxiosError;
        throw new Error(`Auth0 Token Fehler: ${axiosError.response?.data?.error_description || "Unbekannter Fehler"}`);
    }
}
