import Link from "next/link";

export default function LoginPage() {
  const imageSrc =
    "https://images.unsplash.com/photo-1700832082152-0416a3ee5e60?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE (NOW MATCHING REGISTER STYLE) */}
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

          {/* IMAGE */}
          <img
            src={imageSrc}
            alt="doctor consultation"
            className="rounded-[28px] w-full h-[320px] object-cover shadow-lg"
          />

          {/* TEXT (STYLE MATCHED) */}
          <div className="mt-10">
            <h2 className="text-[36px] font-bold text-[#1d2b36] leading-[44px]">
              Your health, <br /> our priority.
            </h2>

            <p className="text-[16px] leading-7 text-gray-600 mt-5 max-w-md">
              Connect with doctors, manage appointments,
              and access healthcare anytime you need.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (NOW MATCHING REGISTER FORM STYLE) */}
        <div className="p-10 md:p-14 flex flex-col justify-center">

          <h2 className="text-[40px] font-bold text-[#1d2b36] mb-10 text-center">
            Welcome Back
          </h2>

          <form className="space-y-6">

            {/* EMAIL */}
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

            {/* PASSWORD */}
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
            <Link href="/register" className="text-[#2f6f7e] font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}