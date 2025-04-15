"use server";
import { getUsersRoles } from "./getUsersRoles";

// Prüft, ob Benutzer die Rolle "admin" hat
export async function isUserAdmin(): Promise<boolean> {
    try {
        const roles = await getUsersRoles();
        console.log("Benutzerrollen:", roles);
        return roles.some((role) => role.name.toLowerCase() === "admin");
    } catch (error) {
        console.error("Fehler beim Admin-Check:", error);
        return false;
    }
}
