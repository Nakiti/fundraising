import { NextResponse } from "next/server";

export const middleware = (req) => {
   const token = req.cookies.get("session");
   const isAuthPage = req.nextUrl.pathname === "/login";
   const isRegisterPage = req.nextUrl.pathname === "/register";
   const isPublicPage = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/organization/");
   const isCreateOrgPage = req.nextUrl.pathname === "/createOrganization";

   // Allow public pages and create organization page regardless of token status
   if (isPublicPage || isCreateOrgPage) {
      return NextResponse.next();
   }

   // If no token and trying to access protected route, redirect to login
   if (!token && !isAuthPage && !isRegisterPage) {
      console.log("No token found, redirecting to login...");
      return NextResponse.redirect(new URL("/login", req.url));
   }

   // For auth pages, allow access regardless of token status
   // The AuthContext will handle token validation and redirect if needed
   if (isAuthPage || isRegisterPage) {
      return NextResponse.next();
   }

   // For protected routes, allow access if token exists
   // The AuthContext will handle invalid token cleanup
   if (token) {
      return NextResponse.next();
   }

   return NextResponse.next();
};

export const config = {
   matcher: [
      "/org/:path*", 
      "/profile", 
      "/login", 
      "/register",
      "/organization/:organizationId/campaign/:campaignId/preview",
      "/createOrganization"
   ],
};
