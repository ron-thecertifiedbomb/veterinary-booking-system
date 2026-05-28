// src/features/auth/providers/AuthProvider.tsx

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";

import { getStorageItem, removeStorageItem } from "@/features/auth/storage";
import { User } from "@/features/users/types";

export type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;

    refreshSession: () => Promise<void>;
    setSession: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

let sessionCache: {
    user: User | null;
    token: string | null;
} = {
    user: null,
    token: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const hydrated = useRef(false);

    // -----------------------------------
    // LOAD SESSION ONCE
    // -----------------------------------

    async function loadSession() {
        try {
            const [storedUser, storedToken] = await Promise.all([
                getStorageItem("user"),
                getStorageItem("access_token"),
            ]);

            const parsedUser: User | null = storedUser
                ? JSON.parse(storedUser)
                : null;

            sessionCache = { user: parsedUser, token: storedToken };

            setUser(parsedUser);
            setToken(storedToken);
        } catch (err) {
            console.error("Auth load error:", err);

            sessionCache = { user: null, token: null };
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
            hydrated.current = true;
        }
    }

    useEffect(() => {
        if (!hydrated.current) {
            loadSession();
        }
    }, []);

    // -----------------------------------
    // API
    // -----------------------------------

    async function refreshSession() {
        setLoading(true);
        await loadSession();
    }

    async function setSession(userData: User, accessToken: string) {
        sessionCache = { user: userData, token: accessToken };
        setUser(userData);
        setToken(accessToken);
    }

    async function logout() {
        // ✓ clear storage on both web and mobile
        await Promise.all([
            removeStorageItem("user"),
            removeStorageItem("access_token"),
        ]);

        sessionCache = { user: null, token: null };
        setUser(null);
        setToken(null);
    }

    const value: AuthContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "ADMIN", // ✓ convenience shortcut

        refreshSession,
        setSession,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// -----------------------------------
// HOOK
// -----------------------------------

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}