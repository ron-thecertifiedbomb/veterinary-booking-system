import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";



import {
    getStorageItem,
    removeStorageItem,
    setStorageItem,
} from "../storage/auth.storage";

import { logger } from "@/utils/logger/logger";
import { ApiError, NetworkError } from "@/utils/api/api.client";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { AuthContextType } from "@/features/auth/types/auth.context";
import { fetchMe } from "@/features/auth/services/fetchMe.api";
import { LoginPayload } from "@/features/auth/types/auth.login";
import { loginApi } from "@/features/auth/services/login.api";
import { RegisterPayload } from "@/features/auth/types/auth.registration";
import { registerApi } from "@/features/auth/services/register.api";
import { logoutApi } from "../services/logout.api";

// ----------------------------------
// MEMORY CACHE (FAST ACCESS)
// ----------------------------------
let sessionCache: {
    user: AuthenticatedUser | null;
    token: string | null;
} = {
    user: null,
    token: null,
};

const AuthContext = createContext<AuthContextType | null>(null);

// ----------------------------------
// PROVIDER
// ----------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const hydrated = useRef(false);
    const validating = useRef(false);

    // ----------------------------------
    // SET SESSION (single source of truth)
    // ----------------------------------
    async function setSession(user: AuthenticatedUser, token: string) {

        await Promise.all([
            
            setStorageItem("user", JSON.stringify(user)),
            setStorageItem("access_token", token),
        ]);
        sessionCache = { user, token };
        setUser(user);
        setToken(token);

        logger.info("Session set");
    }

    // ----------------------------------
    // LOAD SESSION (from storage)
    // ----------------------------------
    async function loadSession() {
        try {
            const [storedUser, storedToken] = await Promise.all([
                getStorageItem("user"),
                getStorageItem("access_token"),
            ]);

            if (!storedUser || !storedToken) return;

            const parsedUser = JSON.parse(storedUser);

            sessionCache = { user: parsedUser, token: storedToken };

            setUser(parsedUser);
            setToken(storedToken);

            logger.info("Session loaded");
        } catch (err) {
            logger.error("Load session error", err);
        }
    }

    // ----------------------------------
    // VALIDATE SESSION (/me)
    // ----------------------------------
    async function validateSession() {
        if (validating.current) return;
        validating.current = true;

        try {
            const storedToken = await getStorageItem("access_token");

            if (!storedToken) {
                await clearSession();
                return;
            }

            const meRes = await fetchMe(storedToken);

            await setSession(meRes.data, storedToken);

            logger.info("Session validated");
        } catch (err) {
            if (err instanceof NetworkError) {
                logger.warn("Offline - keeping session");
                return;
            }

            if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
                await clearSession();
            }
        } finally {
            validating.current = false;
            setLoading(false);
        }
    }

    // ----------------------------------
    // CLEAR SESSION
    // ----------------------------------
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

    // ----------------------------------
    // LOGIN (ORCHESTRATION ✅)
    // ----------------------------------
    async function login(payload: LoginPayload) {
        try {
            setLoading(true);

            const loginRes = await loginApi(payload);
            const access_token = loginRes.data.access_token;
            const meRes = await fetchMe(access_token);
            await setSession(meRes.data, access_token);
            return {
                user: meRes.data,
                message: loginRes.message,
            };
        } finally {
            setLoading(false);
        }
    }

async function register(payload: RegisterPayload) {
        try {
            setLoading(true);

            logger.info("Attempting registration", {
                email: payload.email,
            });

            const response = await registerApi(payload);
            const normalizedUser = {
                ...response.data,
                userId: response.data,
            };
            logger.info("Registration successful", normalizedUser);
            return response;

        } finally {
            setLoading(false);
        }
    }

    // ----------------------------------
    // LOGOUT
    // ----------------------------------
    async function logout() {
        try {
            setLoading(true);
            const storedToken = await getStorageItem("access_token");  
            const response = await logoutApi(storedToken);
            await clearSession();
            return response
        } 
        finally {
            setLoading(false);
        }
    }

    // ----------------------------------
    // Refresh Session
    // ----------------------------------

    async function refreshSession() {
        await loadSession();
        await validateSession(); // <-- this calls fetchMe ✅
    }


    // ----------------------------------
    // UPDATE APPOINTMENTS (NO DUPLICATION)
    // ----------------------------------



    // ----------------------------------
    // INIT SESSION
    // ----------------------------------
    useEffect(() => {
        async function init() {
            if (hydrated.current) return;
            hydrated.current = true;

            setLoading(true);

            await loadSession();
            await validateSession();
        }

        init();
    }, []);

    // ----------------------------------
    // CONTEXT VALUE
    // ----------------------------------
    const value: AuthContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        role: user?.role ?? null,
        isAdmin: user?.role === "ADMIN",
        isStaff: user?.role === "STAFF",
        isCustomer: user?.role === "CUSTOMER",
        register,
        login,
        logout,
        refreshSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ----------------------------------
// HOOK
// ----------------------------------
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}