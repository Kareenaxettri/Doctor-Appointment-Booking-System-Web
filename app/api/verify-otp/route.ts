import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "../otp-store";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || typeof email !== "string" || !otp || typeof otp !== "string") {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const valid = verifyOtp(email, otp);

    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
