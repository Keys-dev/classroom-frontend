import type { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/better-auth-client";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            const result = await authClient.signIn.email({ email, password });

            if (result.error) {
                return {
                    success: false,
                    error: {
                        message: result.error.message ?? "Invalid email or password",
                        name: "Invalid credentials",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error?.message ?? "Login failed",
                    name: "Login error",
                },
            };
        }
    },

    register: async ({ email, password }) => {
        try {
            const result = await authClient.signUp.email({
                email,
                password,
                name: email.split("@")[0],
            } as any);

            if (result.error) {
                return {
                    success: false,
                    error: {
                        message: result.error.message ?? "Registration failed",
                        name: "Registration error",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error?.message ?? "Registration failed",
                    name: "Registration error",
                },
            };
        }
    },

    logout: async () => {
        try {
            await authClient.signOut();
            return {
                success: true,
                redirectTo: "/login",
            };
        } catch {
            return {
                success: true,
                redirectTo: "/login",
            };
        }
    },

    onError: async (error) => {
        if ((error as any).response?.status === 401) {
            return {
                logout: true,
            };
        }

        return {
            error,
        };
    },

    check: async () => {
        const { data: session } = await authClient.getSession();

        if (!session) {
            return {
                authenticated: false,
                redirectTo: "/login",
            };
        }

        return {
            authenticated: true,
        };
    },

    getPermissions: async () => {
        const { data: session } = await authClient.getSession();

        if (session?.user) {
            return [(session.user as any).role ?? "student"];
        }

        return null;
    },

    getIdentity: async () => {
        const { data: session } = await authClient.getSession();

        if (session?.user) {
            return {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: (session.user as any).role ?? "student",
                image: session.user.image ?? "",
            };
        }

        return undefined;
    },

    forgotPassword: async ({ email }) => {
        try {
            const frontendUrl = import.meta.env.VITE_FRONTEND_URL ?? window.location.origin;
            const result = await authClient.requestPasswordReset({
                email,
                redirectTo: `${frontendUrl}/update-password`,
            });

            if (result.error) {
                return {
                    success: false,
                    error: {
                        message: result.error.message ?? "Failed to send reset email",
                        name: "Forgot password error",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/check-email",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error?.message ?? "Failed to send reset email",
                    name: "Forgot password error",
                },
            };
        }
    },

    updatePassword: async ({ password }) => {
        try {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (!token) {
                return {
                    success: false,
                    error: {
                        message: "Invalid reset link. Please request a new password reset.",
                        name: "Invalid token",
                    },
                };
            }

            const result = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (result.error) {
                return {
                    success: false,
                    error: {
                        message: result.error.message ?? "Failed to reset password",
                        name: "Reset password error",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/login",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error?.message ?? "Failed to reset password",
                    name: "Reset password error",
                },
            };
        }
    },

};
