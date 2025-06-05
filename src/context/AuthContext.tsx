import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthType } from '../types';
import { supabase } from './supabaseClient';
import { getProfile, passwordRecover, registerUser } from '@/lib/auth';
import { RegisterUserSchemaType } from '@/lib/schemas';
import { toast } from '@/components/ui/use-toast';
import UseRegistrationStore from '@/store/registration.store';
import UseCompanyStore from '@/store/company.store';
import { Session } from '@supabase/supabase-js';

export interface AuthContextType {
    account: AuthType | null;
    loading: boolean;
    hasError: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Omit<RegisterUserSchemaType, 'id'>) => Promise<boolean>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const saveSession = (session: Session) => {
    if (session) {
        console.log('Saving session:', session);
        // Get the access token directly from the session
        const access_token = session.access_token;
        const refresh_token = session.refresh_token;

        if (!access_token) {
            console.error('No access token in session:', session);
            return;
        }

        const sessionData = {
            access_token,
            refresh_token
        };
        console.log('Saving session data:', sessionData);
        localStorage.setItem('sb-auth-token', JSON.stringify(sessionData));
    } else {
        console.error('No session data provided to saveSession');
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const registrationState = UseRegistrationStore();
    const companyState = UseCompanyStore();
    const [account, setAccount] = useState<AuthType | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasError, setError] = useState(false);

    useEffect(() => {
        console.log('account', account);
        // Check for existing session on mount
        const getSession = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                console.log('Current session:', session);

                if (session) {
                    saveSession(session);
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const profile = await getProfile(user.id);
                        if (profile) {
                            setAccount(profile);
                            companyState.saveCompany(profile.company);
                        }
                    }
                } else {
                    setAccount(null);
                }
            } catch (error) {
                console.error('Session check failed:', error);
                setError(true);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error al verificar la sesión. Por favor, intenta nuevamente.",
                });
            } finally {
                setLoading(false);
            }
        };
        getSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('login');
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            console.log('Login error:', error);
            if (error) throw error;

            console.log('Login response:', data);
            // Save the session
            if (data.session) {
                saveSession(data.session);
            } else {
                setError(true);
                console.error('No session in login response:', data);
            }

            const profile = await getProfile(data.user.id);
            if (profile) {
                setAccount(profile);
                companyState.saveCompany(profile.company);
            }
        } catch (error) {
            setError(true);
            console.error('Login failed:', error);
            toast({
                variant: "destructive",
                title: "Error de inicio de sesión",
                description: error instanceof Error ? error.message : "Error al iniciar sesión. Por favor, intenta nuevamente.",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: Omit<RegisterUserSchemaType, 'id'>) => {
        try {
            console.log('register');
            setLoading(true);
            const { email, password } = userData;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { data, error } = await supabase.auth.signUp({ email, password: password! });
            if (error) throw error;

            console.log('Register response:', data);
            // Save the session
            if (data.session) {
                saveSession(data.session);
            } else {
                setError(true);
                console.error('No session in register response:', data);
            }

            const response = await registerUser({
                id: data.user?.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                companyId: userData.companyId,
                accountType: userData.accountType,
            });

            if (response.error) {
                toast({
                    variant: "destructive",
                    title: "Error de registro",
                    description: Array.isArray(response.error) ? response.error[0] : response.error,
                });
                setLoading(false);
                return false;
            } else if (response.data) {
                registrationState.saveUserEmail(userData.email);
                toast({
                    title: "Registro exitoso",
                    description: "Tu cuenta ha sido creada correctamente.",
                });
                setLoading(false);
                return true;
            }
            setLoading(false);
            return false;
        } catch (error) {
            setError(true);
            console.error('Registration error:', error);
            toast({
                variant: "destructive",
                title: "Error de registro",
                description: error instanceof Error ? error.message : "Error al registrar el usuario. Por favor, intenta nuevamente.",
            });
            setLoading(false);
            throw error;
        }
    }

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('sb-auth-token');
            setAccount(null);
            toast({
                title: "Sesión cerrada",
                description: "Has cerrado sesión correctamente.",
            });
        } catch (error) {
            setError(true);
            console.error('Logout failed:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al cerrar sesión. Por favor, intenta nuevamente.",
            });
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            setLoading(true);
            // Check if user exists
            const { data: user } = await passwordRecover(email);

            if (!user) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No existe una cuenta con ese email.",
                });
                return;
            }
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;

            toast({
                title: "Email enviado",
                description: "Se ha enviado un email con instrucciones para restablecer tu contraseña.",
            });
        } catch (error) {
            setError(true);
            console.error('Forgot password failed:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Error al enviar el email de recuperación. Por favor, intenta nuevamente.",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (newPassword: string) => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast({
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido actualizada correctamente.",
            });
        } catch (error) {
            setError(true);
            console.error('Reset password failed:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Error al restablecer la contraseña. Por favor, intenta nuevamente.",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ account, loading, hasError, login, register, logout, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}