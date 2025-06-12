import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/card';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordInput from '@/components/passwordInput';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import LoadingIndicator from '@/components/loadingIndicator';
import { useEffect } from 'react';
import { supabase } from '@/context/supabaseClient';
import { useGlobalLoading } from '../../store/globalLoading.store';

export const Route = createFileRoute('/_authLayout/reset-password')({
    validateSearch: (search: Record<string, unknown>) => ({
        hash: (search?.hash as string) || '',
    }),
    component: () => <ResetPassword />
});

const ResetPasswordSchema = z.object({
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type Schema = z.infer<typeof ResetPasswordSchema>;

function ResetPassword() {
    const { show, hide } = useGlobalLoading();
    const { hash } = Route.useSearch();
    const router = useRouter();
    const { resetPassword, loading } = useAuth();

    const form = useForm<Schema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    // Intercambia el token de la URL por una sesión válida
    useEffect(() => {
        const handleToken = async () => {
            if (!hash) return;
            show('Verificando token...');

            try {
                const fullUrl = `${window.location.origin}/reset-password#${hash}`;
                const params = new URLSearchParams(hash);
                const access_token = params.get('access_token');

                if (!access_token) return;

                const { error } = await supabase.auth.exchangeCodeForSession(fullUrl);
                if (error) {
                    console.error('Session exchange error:', error.message);
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'El enlace de recuperación es inválido o ha expirado.',
                    });
                }
            } finally {
                hide();
            }
        };

        handleToken();
    }, [hash, show, hide]);

    // Limpia la URL después de usar el token
    useEffect(() => {
        if (window.location.search.includes('hash=')) {
            const url = new URL(window.location.href);
            url.searchParams.delete('hash');
            window.history.replaceState({}, '', url.pathname);
        }
    }, []);

    const onSubmit = async (data: Schema) => {
        try {
            await resetPassword(data.password);
            toast({
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido actualizada correctamente. Serás redirigido al login.",
            });
            router.navigate({ to: '/login' });
        } catch (error) {
            console.error("Error reset password:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar la contraseña. Por favor, intenta nuevamente.",
            });
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full'>
                <Card>
                    <CardHeader>
                        <div className='h-24 flex flex-col justify-center'>
                            <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
                                Restablecer Contraseña
                            </h2>
                            <p className='text-muted text-sm md:text-base'>Ingresa tu nueva contraseña</p>
                        </div>
                    </CardHeader>
                    <CardBody className='space-y-8 m-auto h-auto w-2/4'>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nueva Contraseña</FormLabel>
                                    <FormControl>
                                        <PasswordInput fieldName={field.name} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Contraseña</FormLabel>
                                    <FormControl>
                                        <PasswordInput fieldName={field.name} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardBody>
                    <CardFooter>
                        <div className='flex flex-col-reverse md:flex-row justify-between items-center min-h-20'>
                            <Link to="/login" disabled={loading}>
                                <Button className='-ml-3' variant="link" disabled={loading}>
                                    Volver al Login
                                </Button>
                            </Link>
                            <Button disabled={loading} type="submit" className='min-w-[200px]'>
                                {loading ? <LoadingIndicator className="w-4 h-4" /> : 'Actualizar Contraseña'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    );
}
