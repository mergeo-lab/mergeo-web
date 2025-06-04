import Card, { CardHeader, CardBody, CardFooter } from '@/components/card';
import LoadingIndicator from '@/components/loadingIndicator';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { passwordRecover } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/_authLayout/forgotPassword')({
    component: () => <ForgotPassword />
})

const PssswordRecoverSchema = z.object({
    email: z.string().min(1, { message: "Tienes que completar este campo!" }).email("Ingresa un email valido!"),
});

type Schema = z.infer<typeof PssswordRecoverSchema>

function ForgotPassword() {
    const { forgotPassword, loading } = useAuth();
    const mutation = useMutation({ mutationFn: passwordRecover })

    const form = useForm<Schema>({
        resolver: zodResolver(PssswordRecoverSchema),
        disabled: mutation.isPending,
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (fields: Schema) => {
        await forgotPassword(fields.email);
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full'>
                <Card>
                    <CardHeader>
                        <div className='h-24 flex flex-col justify-center'>
                            <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
                                Recuperar contraseña
                            </h2>
                            <p className='text-muted text-sm md:text-base'>Ingresa tu mail y te enviaremos un link para poder rstablecer tu contraseña</p>
                        </div>
                    </CardHeader>
                    <CardBody className={cn('space-y-8 m-auto h-auto w-1/2')}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel id='email'>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            <Button disabled={loading} className='min-w-[200px]' type="submit">
                                {loading ? <LoadingIndicator className="w-4 h-4 text-primary-foreground" /> : 'Enviar'}
                            </Button>

                        </div>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    )
}