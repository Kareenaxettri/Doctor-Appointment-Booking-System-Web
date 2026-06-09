"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "@/app/(auth)/_components/schema";
import { handleLoginUser } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { checkAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setError("");

    startTransition(async () => {
      try {
        const result = await handleLoginUser(data);

        if (result.success) {
          await checkAuth();
          router.push("/dashboard");
        } else {
          setError(result.message || "Login failed");
        }
      } catch (error: any) {
        setError(error?.message || "Login failed");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4">

      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex w-full max-w-5xl">

        {/* LEFT PANEL (DOCTOR IMAGE - CLEAN) */}
        <div className="hidden md:flex md:w-[45%] relative flex-col min-h-[580px]">

          <div className="absolute inset-0">
            <img
              src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3MHxzZWFyY2h8MTd8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
              alt="Doctor login"
              className="w-full h-full object-cover"
            />
          </div>

          {/* subtle text bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/25 text-white">
            <h2 className="text-xl font-bold mb-1">
              Medi Click
            </h2>
            <p className="text-sm text-white/90 leading-snug">
              Access your medical dashboard and manage appointments easily.
            </p>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-10 md:p-14 relative">

          <div className="mb-6">
            <h1 className="text-[40px] font-bold text-[#1d2b36] mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to continue your healthcare journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {error && (
              <div className="p-3 rounded-xl bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-gray-800
                outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[15px] font-medium text-gray-700">
                  Password
                </label>

                <a href="#" className="text-xs text-gray-500 hover:text-[#2f6f7e]">
                  Forgot Password?
                </a>
              </div>

              <input
                type="password"
                placeholder="Enter password"
                {...register("password")}
                className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-gray-800
                outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-[#2f6f7e] hover:bg-[#285c68] text-white py-4 rounded-2xl text-[16px] font-semibold transition shadow-lg disabled:opacity-50"
            >
              {isPending ? "Logging in..." : "Login"}
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