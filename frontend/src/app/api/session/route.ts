import { getSession } from "@auth0/nextjs-auth0";

export async function GET() {
    const session = await getSession();

    if (!session || !session.user) {
        return Response.json({ user: null }, { status: 204 });
    }

    return Response.json(session, { status: 200 });
}
