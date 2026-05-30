// src/features/auth/providers/AuthProvider.tsx

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { Redirect } from "expo-router";

import { api } from "@/utils/api";
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

const AuthContext =
    createContext<AuthContextType | null>(
        null
    );

let sessionCache: {
    user: AuthUser | null;
    token: string | null;
} = {
    user: null,
    token: null,
};

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<AuthUser | null>(null);

    const [token, setToken] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    const hydrated = useRef(false);

    // -----------------------------------
    // LOAD SESSION
    // -----------------------------------

    async function loadSession() {
        try {
            const [
                storedUser,
                storedToken,
            ] = await Promise.all([
                getStorageItem("user"),

                getStorageItem(
                    "access_token"
                ),
            ]);

            const parsedUser: AuthUser | null =
                storedUser
                    ? JSON.parse(storedUser)
                    : null;

            sessionCache = {
                user: parsedUser,
                token: storedToken,
            };

            setUser(parsedUser);
            setToken(storedToken);

            logger.info(
                "Session loaded successfully"
            );

        } catch (err) {
            logger.error(
                "Auth load error",
                err
            );

            sessionCache = {
                user: null,
                token: null,
            };

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

            removeStorageItem(
                "access_token"
            ),
        ]);

        sessionCache = {
            user: null,
            token: null,
        };

        setUser(null);
        setToken(null);

        logger.info(
            "Session cleared"
        );
    }

    // -----------------------------------
    // VALIDATE SESSION
    // -----------------------------------

    async function validateSession() {
        try {
            const storedToken =
                await getStorageItem(
                    "access_token"
                );

            if (!storedToken) {
                await clearSession();
                return;
            }

            const response = await api<{
                data: {
                    user: AuthUser;
                };
            }>("/api/vet/auth/me", {
                method: "GET",
                token: storedToken,
            });

            if (!response?.data?.user) {
                throw new Error(
                    "Invalid session"
                );
            }

            logger.info(
                "Session validated successfully"
            );

        } catch (err) {
            logger.error(
                "Session validation failed",
                err
            );

            await clearSession();

        } finally {
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
        setLoading(true);

        await loadSession();

        await validateSession();
    }

    async function setSession(
        userData: AuthUser,
        accessToken: string
    ) {
        await Promise.all([
            setStorageItem(
                "user",
                JSON.stringify(userData)
            ),

            setStorageItem(
                "access_token",
                accessToken
            ),
        ]);

        sessionCache = {
            user: userData,
            token: accessToken,
        };

        setUser(userData);
        setToken(accessToken);

        logger.info(
            "Session updated"
        );
    }

    async function updateUser(
        updatedUser: Partial<AuthUser>
    ) {
        if (!user || !token) return;

        const newUser = {
            ...user,
            ...updatedUser,
        };

        await setStorageItem(
            "user",
            JSON.stringify(newUser)
        );

        sessionCache.user = newUser;

        setUser(newUser);

        logger.info(
            "User updated in session",
            newUser
        );
    }

    // -----------------------------------
    // AUTH
    // -----------------------------------

    async function login(
        payload: LoginPayload
    ) {
        return loginService(payload, {
            setLoading,
            setSession,
        });
    }

    async function register(
        payload: RegisterPayload
    ) {
        return registerService(payload, {
            setLoading,
        });
    }

    async function logout() {
        return logoutService({
            token,

            setLoading,

            setUser,

            setToken,

            removeStorageItem,

            clearSessionCache: () => {
                sessionCache = {
                    user: null,
                    token: null,
                };
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

        isAuthenticated:
            !!user && !!token,

        isAdmin:
            user?.role === "ADMIN",

        refreshSession,

        updateUser,

        setSession,

        logout,

        login,

        register,
    };


    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}

// -----------------------------------
// HOOK
// -----------------------------------

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}