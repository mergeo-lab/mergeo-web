import { createFileRoute, useRouter } from '@tanstack/react-router';
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
            token: (search?.token as string) || '',
        };
    },
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
    const { token } = Route.useSearch();
    const router = useRouter();
    const { resetPassword, loading } = useAuth();

    const form = useForm<Schema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    useEffect(() => {
        const url = window.location.href;
        show('Verificando token...');
        const handleToken = async () => {
            const { error } = await supabase.auth.exchangeCodeForSession(url);
            if (error) {
                console.error("Token exchange failed:", error.message);
                // Podés redirigir o mostrar un mensaje
            } else {
                console.log("Token accepted. User is now authenticated.");
            }
            hide();
        };

        handleToken();
    }, [hide, show]);

    const onSubmit = async (data: Schema) => {
        try {
            await resetPassword(token, data.password);
            toast({
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido actualizada correctamente. Serás redirigido al login.",
            });
            router.navigate({ to: '/login' });
        } catch (error) {
            console.log("error reset password", error);
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
                        <div className='flex justify-end w-full'>
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