import { redirect } from "next/navigation";
import { getTokenCookie, getUserData } from "@/lib/cookies";

export default async function Home() {
  const token = await getTokenCookie();
  const user = await getUserData();

  if (token && user?.role === "admin") {
    redirect("/admin/users");
  }

  redirect("/login");
}
