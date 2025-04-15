import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return new Response("Unauthorized", { status: 401 });
  return new Response(JSON.stringify({ user: session.user }), { status: 200 });
}
