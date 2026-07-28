import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveOtp } from "../otp-store";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = generateOtp();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Doctor Appointment" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Payment Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="background: #2f6f7e; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h2 style="margin: 0; font-size: 18px;">Payment Verification</h2>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; padding: 32px; border-radius: 0 0 12px 12px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 16px;">Use the following code to verify your payment:</p>
            <div style="background: #f8fafc; border: 2px dashed #2f6f7e; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2f6f7e;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">This code expires in 5 minutes. Do not share it with anyone.</p>
          </div>
        </div>
      `,
    });

    saveOtp(email, otp);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
