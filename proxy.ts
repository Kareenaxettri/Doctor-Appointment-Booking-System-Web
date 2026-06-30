import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const userDataRaw = request.cookies.get("user_data")?.value;

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let role: string | undefined;
    try {
      role = userDataRaw ? JSON.parse(userDataRaw)?.role : undefined;
    } catch {
      role = undefined;
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
