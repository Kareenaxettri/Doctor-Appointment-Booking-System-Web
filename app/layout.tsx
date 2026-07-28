import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import ThemeProvider from "@/components/ThemeProvider";
import ChatbotWidget from "@/components/ChatbotWidget";

export const metadata: Metadata = {
  title: "MediClick - Doctor Appointment Booking System",
  description: "Book doctor appointments online, manage your healthcare visits, and connect with trusted specialists across Kathmandu.",
  keywords: ["doctor appointment", "healthcare", "booking", "medical", "Kathmandu", "Nepal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <ChatbotWidget />
      </body>
    </html>
  );
}