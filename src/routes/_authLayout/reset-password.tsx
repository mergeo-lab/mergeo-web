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
    validateSearch: (search: Record<string, unknown>) => {
        return {
            access_token: (search?.access_token as string) || '',
            refresh_token: (search?.refresh_token as string) || '',
            type: (search?.type as string) || '',
        };
    },
    component: () => <ResetPassword />,
});

const ResetPasswordSchema = z
    .object({
        password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

type Schema = z.infer<typeof ResetPasswordSchema>;

function ResetPassword() {
    const { show, hide } = useGlobalLoading();
    const { access_token, refresh_token, type } = Route.useSearch();
    const router = useRouter();
    const { resetPassword, loading } = useAuth();

    const form = useForm<Schema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        const handleToken = async () => {
            if (type === 'recovery' && access_token && refresh_token) {
                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });

                if (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'El enlace de recuperación es inválido o ha expirado.',
                    });
                }
            }
            hide();
        };

        show('Verificando token...');
        handleToken();
    }, [access_token, refresh_token, type, show, hide]);

    const onSubmit = async (data: Schema) => {
        try {
            await resetPassword(data.password);
            toast({
                title: 'Contraseña actualizada',
                description: 'Tu contraseña ha sido actualizada correctamente. Serás redirigido al login.',
            });
            router.navigate({ to: '/login' });
        } catch (error) {
            console.log('error reset password', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo actualizar la contraseña. Por favor, intenta nuevamente.',
            });
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full">
                <Card>
                    <CardHeader>
                        <div className="h-24 flex flex-col justify-center">
                            <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
                                Restablecer Contraseña
                            </h2>
                            <p className="text-muted text-sm md:text-base">Ingresa tu nueva contraseña</p>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-8 m-auto h-auto w-2/4">
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
                        <div className="flex flex-col-reverse md:flex-row justify-between items-center min-h-20">
                            <Link to="/login" disabled={loading}>
                                <Button className="-ml-3" variant="link" disabled={loading}>
                                    Volver al Login
                                </Button>
                            </Link>
                            <Button disabled={loading} type="submit" className="min-w-[200px]">
                                {loading ? <LoadingIndicator className="w-4 h-4" /> : 'Actualizar Contraseña'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    );
}
