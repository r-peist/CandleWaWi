import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const namespace = process.env.NEXT_PUBLIC_AUTH0_NAMESPACE || 'default';
    const roles = decodedToken[namespace] || [];

    if (!roles.includes("Admin")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
