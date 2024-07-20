import Card, { CardHeader, CardBody, CardFooter } from '@/components/card';
import CountDownIndicator from '@/components/countdown';
import LoadingIndicator from '@/components/loadingIndicator';
import PasswordInput from '@/components/passwordInput';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { passwordReset } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';

type TokenSearch = { token: string };

export const Route = createFileRoute('/_authLayout/passwordReset')({
    validateSearch: (search: Record<string, unknown>): TokenSearch => {
        return {
            token: (search?.token) as string || '',
        };
    },
    component: () => <PasswordRecover />
})

const PssswordRecoverSchema = z.object({
    password: z.string().min(3, { message: "Tiene que tener al menos 3 caracteres!" }),
});

type Schema = z.infer<typeof PssswordRecoverSchema>

function PasswordRecover() {
    const { token } = Route.useSearch();
    const router = useRouter();
    const { toast } = useToast()
    const mutation = useMutation({ mutationFn: passwordReset })
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm<Schema>({
        resolver: zodResolver(PssswordRecoverSchema),
        disabled: mutation.isPending,
        defaultValues: {
            password: "",
        },
    })

    const onSubmit = async (fields: Schema) => {
        const response = await mutation.mutateAsync({ token, password: fields.password });

        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            setEmailSent(true);
        }
    }

    const redirectToLogin = () => {
        const redirectTo = '/login';
        router.history.push(redirectTo, { replace: true });
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full'>
                <Card>
                    <CardHeader>
                        <div className='h-24 flex flex-col justify-center'>
                            <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
                                Nueva Contraseña
                            </h2>
                            <p className='text-muted text-sm md:text-base'>Ingresa una nueva contraseña para restaurar tu accesso a la plataforma</p>
                        </div>
                    </CardHeader>
                    <CardBody className={cn('space-y-8 m-auto h-auto', {
                        'w-2/4': !emailSent
                    })}>
                        {
                            emailSent
                                ? <div className='text-center space-y-4 flex flex-col items-center'>
                                    <CircleCheckBig size={100} className="text-primary" />
                                    <h2 className='font-medium text-2xl text-center'>
                                        Gracias!
                                    </h2>
                                    <p>
                                        Tu contraseña ha sido cambiada con exito!
                                    </p>
                                    <CountDownIndicator
                                        showTimer
                                        label='Redirigiendo al Login en'
                                        time={20}
                                        callback={redirectToLogin}
                                    />
                                </div>
                                : (
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel id='password'>Contraseña</FormLabel>
                                                <FormControl>
                                                    <div className='relative'>
                                                        <PasswordInput fieldName={field.name} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                        }
                    </CardBody>
                    <CardFooter>
                        <div className='flex flex-col-reverse md:flex-row justify-between items-center min-h-24'>
                            <p className='text-sm text-muted'>
                                Me confundi, no quiero estar aqui!
                                <Link to="/login">
                                    <Button className='-ml-3' variant="link">
                                        Volver al login
                                    </Button>
                                </Link>
                            </p>
                            <Button disabled={mutation.isPending || emailSent} className='min-w-[200px]' type="submit">
                                {mutation.isPending ? <LoadingIndicator className="w-4 h-4 text-primary-foreground" /> : 'Enviar'}
                            </Button>

                        </div>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}