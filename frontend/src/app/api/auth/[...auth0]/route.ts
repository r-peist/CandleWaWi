// frontend/src/app/api/auth/[...auth0]/route.ts
import { handleAuth } from '@auth0/nextjs-auth0/edge';

export const GET = handleAuth();
export const POST = handleAuth();
