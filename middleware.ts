import csrf from "edge-csrf";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// initalize protection function
const csrfProtect = csrf({
  cookie: {
    name: "_csrfSecret",
    path: "/",
    maxAge: undefined,
    domain: '',
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  },
  ignoreMethods: ["GET", "HEAD", "OPTIONS"],
  saltByteLength: 8,
  secretByteLength: 18,
  token: {
    responseHeader: "X-CSRF-Token",
    value: undefined,
  },
});

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // csrf protection
  const csrfError = await csrfProtect(request, response);

  // check result
  if (csrfError) {
    console.log(csrfError);
    return new NextResponse("invalid csrf token", { status: 403 });
  }

  return response;
}
