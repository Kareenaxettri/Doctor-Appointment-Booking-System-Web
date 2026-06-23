"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterFormData,
} from "@/app/(auth)/_components/schema";

import { handleRegisterUser } from "@/lib/actions/auth-action";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setError("");

    startTransition(async () => {
      try {
        const result = await handleRegisterUser(data);

        if (result.success) {
          router.push("/login");
        } else {
          setError(result.message || "Registration failed");
        }
      } catch (error: any) {
        setError(error?.message || "Registration failed");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4">

      <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex w-full max-w-5xl">

        {/* LEFT PANEL - DOCTOR IMAGE (NO COLOR OVERLAY) */}
        <div className="hidden md:flex md:w-[45%] relative flex-col min-h-[580px]">

          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
              alt="Doctors at Medi Click"
              className="w-full h-full object-cover"
            />
          </div>

          {/* subtle readability only (NOT color overlay) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/25 text-white">
            <h2 className="text-xl font-bold mb-1">
              Medi Click
            </h2>
            <p className="text-sm text-white/90 leading-snug">
              Connect with verified doctors and book appointments instantly.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-10 md:p-14 relative">

          <div className="mb-6">
            <h1 className="text-[38px] font-bold text-[#1d2b36] mb-1">
              Create Account
            </h1>
            <p className="text-sm text-gray-500">
              Register to access doctors and manage appointments
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {error && (
              <div className="p-3 rounded-xl bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* FULL NAME */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-gray-800
                outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email"
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

            {/* PHONE NUMBER + GENDER */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[15px] font-medium mb-2 text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="98XXXXXXXX"
                  {...register("contactNumber")}
                  className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-gray-800
                  outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[15px] font-medium mb-2 text-gray-700">
                  Gender
                </label>
                <select
                  defaultValue=""
                  {...register("gender")}
                  className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-gray-800
                  outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create password"
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-gray-800
                outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* TERMS */}
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-[#2f6f7e]" />
              <p className="text-sm text-gray-600">
                I agree to the terms and conditions
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-[#2f6f7e] hover:bg-[#285c68] text-white py-4 rounded-2xl text-[16px] font-semibold transition shadow-lg disabled:opacity-50"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN */}
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
