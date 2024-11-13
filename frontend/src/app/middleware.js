import { NextResponse } from "next/server";

export function middleware (req) {
   const token = req.cookies.get("session")

   console.log("ran")

   const isAuthPage = req.nextUrl.pathname == "/login"

   if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", req.url))
   }

   if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/org/dashboard/campaigns", req.url));
   }

   return NextResponse.next()
}


export const config = {
   matcher: "/"
}