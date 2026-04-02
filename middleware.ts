import { NextResponse, type NextRequest } from "next/server";

import { getCmsBasePath } from "@/lib/env";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

const ALLOWLIST = ["/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

function isBypassPath(pathname: string): boolean {
  return ALLOWLIST.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cmsBasePath = getCmsBasePath();

  if (isBypassPath(pathname)) {
    return NextResponse.next();
  }

  // Prevent direct access to the internal route namespace.
  if (pathname.startsWith("/_cms")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!pathname.startsWith(cmsBasePath)) {
    return NextResponse.next();
  }

  const loginPath = `${cmsBasePath}/login`;
  if (pathname === loginPath) {
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
