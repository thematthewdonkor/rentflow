import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthRoute = authRoutes.includes(pathname);

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session && !isAuthRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"],
};
