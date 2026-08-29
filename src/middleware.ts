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

  // If Supabase is not configured (demo/prototype mode), allow easy navigation
  if (!isMiddlewareSupabaseConfigured) {
    return NextResponse.next();
  }

  const { response, user, role } = await updateSession(request);

  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isCustomerRoute = pathname.startsWith("/dashboard/customer");
  const isVendorRoute = pathname.startsWith("/dashboard/vendor");
  const isCourierRoute = pathname.startsWith("/dashboard/courier");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isDashboardIndex = pathname === "/dashboard" || pathname === "/dashboard/";
  const isProtectedGeneralRoute = pathname.startsWith("/account") || pathname === "/checkout";

  // Normalize role
  const normalizedRole = (role || "customer").toLowerCase();

  // 1. Unauthenticated users trying to access protected routes
  if (!user) {
    if (isCustomerRoute || isVendorRoute || isCourierRoute || isAdminRoute || isDashboardIndex || isProtectedGeneralRoute) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // 2. Authenticated user visiting /dashboard directly -> redirect to role-specific dashboard
  if (isDashboardIndex) {
    if (normalizedRole === "vendor" || normalizedRole === "vendeur") {
      return NextResponse.redirect(new URL("/dashboard/vendor", request.url));
    }
    if (normalizedRole === "courier" || normalizedRole === "livreur") {
      return NextResponse.redirect(new URL("/dashboard/courier", request.url));
    }
    if (normalizedRole === "admin" || normalizedRole === "superadmin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // 3. Authenticated user visiting auth login/register pages -> redirect to appropriate dashboard
  if (isAuthRoute) {
    if (normalizedRole === "vendor" || normalizedRole === "vendeur") {
      return NextResponse.redirect(new URL("/dashboard/vendor", request.url));
    }
    if (normalizedRole === "courier" || normalizedRole === "livreur") {
      return NextResponse.redirect(new URL("/dashboard/courier", request.url));
    }
    if (normalizedRole === "admin" || normalizedRole === "superadmin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // 4. Strict Role-Based Access Control (RBAC)
  // Non-vendor visiting vendor dashboard
  if (isVendorRoute && normalizedRole !== "vendor" && normalizedRole !== "vendeur" && normalizedRole !== "admin") {
    if (normalizedRole === "courier" || normalizedRole === "livreur") {
      return NextResponse.redirect(new URL("/dashboard/courier", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // Non-courier visiting courier dashboard
  if (isCourierRoute && normalizedRole !== "courier" && normalizedRole !== "livreur" && normalizedRole !== "admin") {
    if (normalizedRole === "vendor" || normalizedRole === "vendeur") {
      return NextResponse.redirect(new URL("/dashboard/vendor", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // Non-admin visiting admin dashboard
  if (isAdminRoute && normalizedRole !== "admin" && normalizedRole !== "superadmin") {
    if (normalizedRole === "vendor" || normalizedRole === "vendeur") {
      return NextResponse.redirect(new URL("/dashboard/vendor", request.url));
    }
    if (normalizedRole === "courier" || normalizedRole === "livreur") {
      return NextResponse.redirect(new URL("/dashboard/courier", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
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
