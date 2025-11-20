import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  const protectedRoutes = ["/dashboard", "/editor"];

  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  console.log("Is Protected Route:", isProtected);

  if (isProtected && !token) {
    console.log(" No token — redirecting to /login");
    const loginUrl = new URL("/signin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log(" Access allowed");
  return NextResponse.next();
}

// Middleware match config
export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*"],
};
