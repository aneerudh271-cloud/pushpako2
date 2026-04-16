"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useCurrentUser() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkUser() {
            // 1. If NextAuth has a session, use it
            if (status === "authenticated" && session?.user) {
                setUser({
                    ...session.user,
                    id: session.user.id // Ensure ID is present
                });
                setLoading(false);
                return;
            }

            // 2. If NextAuth is loading, wait
            if (status === "loading") return;

            // 3. If NextAuth is unauthenticated, check custom auth via API
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkUser();
    }, [session, status]);

    return { user, loading };
}
