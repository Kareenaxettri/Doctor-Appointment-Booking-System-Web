"use client";
import { useAuth } from "@/lib/contexts/AuthContext";
// import { getUserData } from "@/lib/cookies";
export default function DashboardPage() {
    // const userData = await getUserData();
    const { user, logout } = useAuth();
    return (
        <>
            {
                user && <>
                    <p>Welcome, {user?.email}!</p>
                    <button onClick={logout}>Logout</button>
                </>
            }
            {
                !user && <>
                    <p>Please log in to view your dashboard.</p>
                </>
            }
        </>
    );
}