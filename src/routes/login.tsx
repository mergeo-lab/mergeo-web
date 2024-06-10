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


export const Route = createFileRoute('/login')({
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
    <div className="flex min-h-full flex-1 flex-col justify-start pt-[5%] lg:pt-0 lg:justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <Logo /> */}
        <h2 className="text-center text-3xl font-title font-bold tracking-widest uppercase text-f12-creame">
          Ingresa a tu cuenta
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
          {/* EMAIL */}
          <div className="h-[60px]">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-f12-creame">
              Email
            </label>
            <div>
              <input
                id="email"
                disabled={false}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-f12-orange sm:text-sm sm:leading-6"
                {...register("email")} />
              <ErrorMessage errors={errors} name="email"
                render={({ message }) =>
                  <p className="text-red-400 text-sm pt-1">{message}</p>
                }
              />
            </div>
          </div>
          {/* CONTRASEÑA */}
          <div className="h-[70px]">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-f12-creame">
                Contraseña
              </label>
              <div className="text-sm">
                <a href="/forgot-password" className="font-semibold text-f12-blue hover:text-f12-blue-light">
                  Olvidaste la contraseña?
                </a>
              </div>
            </div>
            <div className="relative">
              <input
                id="password"
                disabled={false}
                className="block w-full rounde  d-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-f12-orange sm:text-sm sm:leading-6"
                {...register("password")}
                type={isPasswordVisible ? "text" : "password"}
              />
              <PasswordVisible isPasswordVisible={isPasswordVisible} togglePasswordVisibility={togglePasswordVisibility} />
              <ErrorMessage errors={errors} name="password"
                render={({ message }) =>
                  <p className="text-red-400 text-sm pt-1">{message}</p>
                }
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="default"
            >
              Ingresar
            </Button>
          </div>
        </form>
        <p className="mt-5 text-center text-sm text-f12-creame">
          No tenes una cuenta?{' '}
          <Link to="/register" className="font-semibold leading-6 text-f12-blue hover:text-f12-blue-light">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login;
