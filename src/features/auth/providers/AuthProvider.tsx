// src/features/auth/providers/AuthProvider.tsx

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { api, ApiError, NetworkError } from "@/utils/api";
import { logger } from "@/utils/logger";

import { AuthContextType } from "@/features/auth/providers/types";

import {
    getStorageItem,
    removeStorageItem,
    setStorageItem,
} from "@/features/auth/storage";

import {
    AuthUser,
    LoginPayload,
    RegisterPayload,
} from "@/features/auth/types";

import { logout as logoutService } from "@/features/auth/services/logout";
import { login as loginService } from "@/features/auth/services/login";
import { register as registerService } from "@/features/auth/services/register";

const AuthContext = createContext<AuthContextType | null>(null);

let sessionCache: {
    user: AuthUser | null;
    token: string | null;
} = {
    user: null,
    token: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const hydrated = useRef(false);

    // -----------------------------------
    // LOAD SESSION
    // -----------------------------------

    async function loadSession() {
        try {
            const [storedUser, storedToken] = await Promise.all([
                getStorageItem("user"),
                getStorageItem("access_token"),
            ]);

            const parsedUser: AuthUser | null = storedUser
                ? JSON.parse(storedUser)
                : null;

            sessionCache = {
                user: parsedUser,
                token: storedToken,
            };

            // ✅ only update state if we got data, don't flash null
            if (parsedUser) setUser(parsedUser);
            if (storedToken) setToken(storedToken);

            logger.info("Session loaded successfully");

        } catch (err) {
            logger.error("Auth load error", err);
            sessionCache = { user: null, token: null };
            setUser(null);
            setToken(null);
        }
    }

    // -----------------------------------
    // CLEAR SESSION
    // -----------------------------------

    async function clearSession() {
        await Promise.all([
            removeStorageItem("user"),
            removeStorageItem("access_token"),
        ]);

        sessionCache = { user: null, token: null };
        setUser(null);
        setToken(null);

        logger.info("Session cleared");
    }

    // -----------------------------------
    // VALIDATE SESSION
    // -----------------------------------

    const validating = useRef(false);

    async function validateSession() {
        if (validating.current) return; // ✅ prevent concurrent calls
        validating.current = true;

        try {
            const storedToken = await getStorageItem("access_token");

            if (!storedToken) {
                await clearSession();
                return;
            }

            const response = await api<{
                data: { user: AuthUser };
            }>("/api/vet/auth/me", {
                method: "GET",
                token: storedToken,
            });

            if (!response?.data?.user) {
                throw new Error("Invalid session");
            }

            const freshUser = {
                ...response.data.user,
                userId: response.data.user.id,
            };

            await setStorageItem("user", JSON.stringify(freshUser));
            sessionCache.user = freshUser;
            setUser(freshUser);

            logger.info("Session validated successfully");

        } catch (err) {
            if (err instanceof NetworkError) {
                logger.warn("No internet during validation, keeping session");
                return;
            }

            if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
                logger.error("Session expired, clearing session");
                await clearSession();
                return;
            }

            logger.warn("Server error during validation, keeping session", err);

        } finally {
            validating.current = false; // ✅ release lock
            setLoading(false);
        }
    }
    // -----------------------------------
    // HYDRATE SESSION
    // -----------------------------------

    useEffect(() => {
        async function hydrateSession() {
            if (hydrated.current) return;
            hydrated.current = true;
            setLoading(true);
            await loadSession();
            await validateSession();
        }

        hydrateSession();
    }, []);

    // -----------------------------------
    // SESSION HELPERS
    // -----------------------------------

    async function refreshSession() {
        // ✅ no setLoading(true) — silent refresh, avoids redirect flash
        await loadSession();
        await validateSession();
    }

    async function setSession(userData: AuthUser, accessToken: string) {
        await Promise.all([
            setStorageItem("user", JSON.stringify(userData)),
            setStorageItem("access_token", accessToken),
        ]);

        sessionCache = { user: userData, token: accessToken };
        setUser(userData);
        setToken(accessToken);

        logger.info("Session updated");
    }

    async function updateUser(updatedUser: Partial<AuthUser>) {
        if (!user || !token) return;

        const newUser = { ...user, ...updatedUser };

        await setStorageItem("user", JSON.stringify(newUser));
        sessionCache.user = newUser;
        setUser(newUser);

        logger.info("User updated in session", newUser);
    }

    // -----------------------------------
    // AUTH
    // -----------------------------------

    async function login(payload: LoginPayload) {
        return loginService(payload, { setLoading, setSession });
    }

    async function register(payload: RegisterPayload) {
        return registerService(payload, { setLoading });
    }

    async function logout() {
        return logoutService({
            token,
            setLoading,
            setUser,
            setToken,
            removeStorageItem,
            clearSessionCache: () => {
                sessionCache = { user: null, token: null };
            },
        });
    }

    // -----------------------------------
    // CONTEXT VALUE
    // -----------------------------------

    const value: AuthContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "ADMIN",
        isStaff: user?.role === "STAFF",
        refreshSession,
        updateUser,
        setSession,
        logout,
        login,
        register,
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