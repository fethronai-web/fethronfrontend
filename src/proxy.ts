import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AGENT_HOST = "aistudio.fethron.com";
const AGENT_ORIGIN = `https://${AGENT_HOST}`;
const STUDIO_HOSTS = new Set(["fethron.com", "www.fethron.com"]);
const STUDIO_ORIGIN = "https://fethron.com";

function requestHost(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  return (forwardedHost ?? request.headers.get("host") ?? "").split(":")[0].toLowerCase();
}

function redirectTo(origin: string, pathname: string, request: NextRequest) {
  const url = new URL(pathname, origin);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url, 308);
}

export function proxy(request: NextRequest) {
  const host = requestHost(request);
  const { pathname } = request.nextUrl;

  if (host === AGENT_HOST) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/fethron-agent", request.url));
    }

    if (pathname === "/fethron-agent") {
      return redirectTo(AGENT_ORIGIN, "/", request);
    }

    if (pathname.startsWith("/fethron-agent/c/")) {
      return redirectTo(AGENT_ORIGIN, pathname.replace("/fethron-agent", ""), request);
    }

    if (pathname.startsWith("/c/")) {
      return NextResponse.rewrite(
        new URL(`/fethron-agent${pathname}${request.nextUrl.search}`, request.url),
      );
    }

    // Every non-agent page belongs to the studio domain, including future pages.
    return redirectTo(STUDIO_ORIGIN, pathname, request);
  }

  if (STUDIO_HOSTS.has(host)) {
    if (pathname === "/fethron-agent") {
      return redirectTo(AGENT_ORIGIN, "/", request);
    }

    if (pathname.startsWith("/fethron-agent/c/")) {
      return redirectTo(AGENT_ORIGIN, pathname.replace("/fethron-agent", ""), request);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Page routes only. Next internals, API routes, and public assets stay available
  // on both hosts because the agent shell loads them from the same deployment.
  matcher: ["/((?!api|_next/static|_next/image|_next/data|.*\\..*).*)"],
};
