// app/api/admin/auth/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  // REPLACE THESE WITH YOUR DESIRED CREDENTIALS
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "askstore2026"; 

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ success: true });
    
    // Set a secure, HTTP-only cookie
    response.cookies.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}