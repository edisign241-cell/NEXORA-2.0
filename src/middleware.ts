import { type NextRequest, NextResponse } from "next/server";
import { updateSession, isMiddlewareSupabaseConfigured } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets, Next.js internals, API routes and favicon bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If Supabase is not configured (demo/prototype mode), allow easy navigation while keeping UX intact
  if (!isMiddlewareSupabaseConfigured) {
    return NextResponse.next();
  }

  const { response, user, role } = await updateSession(request);

  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isVendorRoute = pathname.startsWith("/dashboard/vendor");
  const isCourierRoute = pathname.startsWith("/dashboard/courier");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isProtectedGeneralRoute = pathname.startsWith("/account") || pathname === "/checkout";

  // 1. Unauthenticated users trying to access protected routes
  if (!user) {
    if (isVendorRoute || isCourierRoute || isAdminRoute || isProtectedGeneralRoute) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 2. Authenticated user visiting auth login/register pages -> redirect to appropriate dashboard
  if (isAuthRoute) {
    if (role === "vendor") {
      return NextResponse.redirect(new URL("/dashboard/vendor", request.url));
    }
    if (role === "courier") {
      return NextResponse.redirect(new URL("/dashboard/courier", request.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Role-Based Access Control (RBAC)
  if (isVendorRoute && role !== "vendor" && role !== "admin") {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("required", "vendeur");
    unauthorizedUrl.searchParams.set("current", role || "client");
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (isCourierRoute && role !== "courier" && role !== "admin") {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("required", "livreur");
    unauthorizedUrl.searchParams.set("current", role || "client");
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (isAdminRoute && role !== "admin") {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("required", "admin");
    unauthorizedUrl.searchParams.set("current", role || "client");
    return NextResponse.redirect(unauthorizedUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
