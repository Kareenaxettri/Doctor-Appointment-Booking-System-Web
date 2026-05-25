"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex w-full max-w-5xl">

        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-[45%] relative flex-col min-h-[580px]">
          <div className="absolute inset-0">
            <img
              src="/login.png"
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
              Welcome Back
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[15px] font-medium text-gray-700">
                  Password
                </label>

                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-[#2f6f7e]"
                >
                  Forgot Password?
                </a>
              </div>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#2f6f7e] hover:bg-[#285c68] text-white py-4 rounded-2xl text-[16px] font-semibold transition duration-300 shadow-lg"
            >
              Login to Account
            </button>
          </form>

          {/* ROUTE */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Don’t have an account?{" "}

            <Link
              href="/register"
              className="text-[#2f6f7e] font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}