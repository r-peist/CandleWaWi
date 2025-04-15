"use server";
import { getUsersRoles } from "./getUsersRoles";

export async function isUserMitarbeiter(): Promise<boolean> {
    try {
        const roles = await getUsersRoles();
        return roles.some((role) => role.name.toLowerCase() === "mitarbeiter");
    } catch (error) {
        console.error("Fehler beim Mitarbeiter-Check:", error);
        return false;
    }
}
