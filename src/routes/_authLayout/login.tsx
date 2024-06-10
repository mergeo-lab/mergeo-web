import { createFileRoute, Link, useRouter, useSearch, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import * as z from "zod"
import { zodResolver, } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import { AuthType, LoginSearchParams } from '@/types';
import { isApiResponse, isErrorMessage } from '@/lib/api/guards';
import { ErrorMessage } from '@hookform/error-message';
import PasswordVisible from '@/components/PasswordVisible';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/auth';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


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
  const { redirect: from } = Route.useSearch<LoginSearchParams>()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(LoginSchema),
  })

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  }

  const mutation = useMutation({ mutationFn: login })

  const onSubmit = async (fields: Schema) => {
    console.log(fields)
    const response = await mutation.mutateAsync({ email: fields.email, password: fields.password });

    if (isErrorMessage(response)) {
      console.log(response);
    } else if (isApiResponse<AuthType>(response)) {
      const { data } = response.data;
      logIn(data.user);

      const redirectTo = from || '/';
      router.history.push(redirectTo, { replace: true });
    }
  }

  return (
    <div className='w-full h-full border rounded shadow'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col justify-between w-full h-full'>

          <div className='py-5 px-16 border-b'>
            <div className='h-24 flex flex-col justify-center'>
              <h2 className="text-3xl font-black text-secondary-background pb-2">
                Ingresa a tu cuenta
              </h2>
              <p className='text-muted'>Ingresa tu email y contraseña para ingresar a tu cuenta</p>
            </div>
          </div>

          <div className='h-full w-2/5 flex flex-col justify-center m-auto space-y-8'>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                  <div className='flex justify-between items-center'>
                    <FormLabel>Contraseña</FormLabel>
                    <Button className='m-0 h-0' variant="link">Recuperar contraseña</Button>
                  </div>
                  <FormControl>
                    <div className='relative'>
                      <Input type={isPasswordVisible ? "text" : "password"} {...field} />
                      <PasswordVisible isPasswordVisible={isPasswordVisible} togglePasswordVisibility={togglePasswordVisibility} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <div className='py-5 px-16 border-t'>
            <div className='flex justify-between items-center min-h-24'>
              <p className='text-sm text-muted'>
                No tenes una cuenta?{' '}
                <Link to="/register">
                  <Button className='-ml-3' variant="link">
                    Registrate
                  </Button>
                </Link>
              </p>
              <Button className='px-14' type="submit">Ingresar</Button>
            </div>
          </div>

        </form>
      </Form>
    </div>

  )
}


