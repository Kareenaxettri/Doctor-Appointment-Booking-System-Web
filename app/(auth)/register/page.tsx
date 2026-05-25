import Link from "next/link";

export default function RegisterPage() {
  const imageSrc =
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="bg-[#eef4f7] p-10 md:p-14 flex flex-col justify-center">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[#2f6f7e] text-white flex items-center justify-center text-2xl font-bold shadow-md">
              +
            </div>

            <h1 className="text-3xl font-bold text-[#1d2b36] tracking-tight">
              MediClick
            </h1>
          </div>

          {/* IMAGE (UNCHANGED) */}
          <img
            src={imageSrc}
            alt="doctor consultation"
            className="rounded-[28px] w-full h-[320px] object-cover shadow-lg"
          />

          {/* TEXT (UNCHANGED) */}
          <div className="mt-10">
            <h2 className="text-[36px] font-bold text-[#1d2b36] leading-[44px]">
              Better healthcare <br /> starts here.
            </h2>

            <p className="text-[16px] leading-7 text-gray-600 mt-5 max-w-md">
              Create your account to manage appointments,
              connect with doctors, and access healthcare easily.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (UNCHANGED) */}
        <div className="p-10 md:p-14 flex flex-col justify-center">

          <h2 className="text-[40px] font-bold text-[#1d2b36] mb-10 text-center">
            Create Account
          </h2>

          <form className="space-y-6">

            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            <div>
              <label className="block text-[15px] font-medium mb-2 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#2f6f7e]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-[#2f6f7e]" />
              <p className="text-sm text-gray-600">
                I agree to the terms and conditions
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2f6f7e] hover:bg-[#285c68] text-white py-4 rounded-2xl text-[16px] font-semibold transition duration-300 shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* ONLY CHANGE (ROUTE ONLY) */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2f6f7e] font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}