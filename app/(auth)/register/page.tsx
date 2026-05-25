"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    console.log({fullName,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex w-full max-w-5xl">
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-[45%] relative flex-col min-h-[580px]">
          <div className="absolute inset-0">
            <img
              src= "/register.png"
              alt="doctor consultation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f6f7e]/90 via-transparent to-transparent" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-10 md:p-14 relative">
          <div className="mb-6">
            <h1 className="text-[40px] font-bold text-[#1d2b36] mb-1">
              Create Account
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* FULL NAME */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            {/* TERMS */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#2f6f7e]"
              />

              <p className="text-sm text-gray-600">
                I agree to the terms and conditions
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#2f6f7e] hover:bg-[#285c68] text-white py-4 rounded-2xl text-[16px] font-semibold transition duration-300 shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* ROUTE */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{" "}

            <Link
              href="/login"
              className="text-[#2f6f7e] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}