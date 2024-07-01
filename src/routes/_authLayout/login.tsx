import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { zodResolver, } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import { AuthType, RedirectSearchParams } from '@/types';
import { isApiResponse, isErrorMessage } from '@/lib/api/guards';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/auth';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import LoadingIndicator from '@/components/loadingIndicator';
import Card, { CardBody, CardFooter, CardHeader } from '@/components/card';
import PasswordInput from '@/components/passwordInput';
import { z } from 'zod';

export const Route = createFileRoute('/_authLayout/login')({
  component: () => <Login />,
})

const LoginSchema = z.object({
  email: z.string().min(1, { message: "Tienes que completar este campo!" }).email("Ingresa un email valido!"),
  password: z.string().min(3, { message: "Tiene que tener al menos 3 caracteres!" }),
});

type Schema = z.infer<typeof LoginSchema>

function Login() {
  const { logIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast()
  const { redirect: from } = Route.useSearch<RedirectSearchParams>()
  const mutation = useMutation({ mutationFn: login })

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    disabled: mutation.isPending,
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (fields: Schema) => {
    const response = await mutation.mutateAsync({ email: fields.email, password: fields.password });

    if (isErrorMessage(response)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response,
      })
    } else if (isApiResponse<AuthType>(response)) {
      const { data } = response.data;
      logIn(data.user);

      const redirectTo = from || '/';
      router.history.push(redirectTo, { replace: true });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full'>
        <Card>
          <CardHeader>
            <div className='h-24 flex flex-col justify-center'>
              <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
                Ingresa a tu cuenta
              </h2>
              <p className='text-muted text-sm md:text-base'>Ingresa tu email y contraseña para ingresar a tu cuenta</p>
            </div>
          </CardHeader>
          <CardBody className='space-y-8 w-2/4 m-auto h-auto' >
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

            <div className='flex justify-center items-center min-h-24'>
              <p className='text-sm text-muted'>
                Olvidaste tu contraseña?{' '}
                <Link to="/forgotPassword">
                  <Button className='-ml-3' variant="link">
                    Recuperar Contraseña
                  </Button>
                </Link>
              </p>
            </div>
          </CardBody>
          <CardFooter>
            <div className='flex flex-col-reverse md:flex-row justify-between items-center min-h-24'>
              <p className='text-sm text-muted'>
                No tenes una cuenta?{' '}
                <Link to="/registration">
                  <Button className='-ml-3' variant="link">
                    Registrate
                  </Button>
                </Link>
              </p>
              <Button disabled={mutation.isPending} className='min-w-[200px]' type="submit">
                {mutation.isPending ? <LoadingIndicator className="w-4 h-4 text-primary-foreground" /> : 'Ingresar'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}


