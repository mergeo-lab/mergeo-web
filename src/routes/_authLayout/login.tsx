import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, FieldValues, useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LoadingIndicator from '@/components/loadingIndicator';
import Card, { CardBody, CardFooter, CardHeader } from '@/components/card';
import PasswordInput from '@/components/passwordInput';
import { z } from 'zod';
import { useEffect, memo, } from 'react';
import { ACCOUNT } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';

// Memoize Card and its subcomponents
const MemoizedCard = memo(Card);
const MemoizedCardHeader = memo(CardHeader);
const MemoizedCardBody = memo(CardBody);
const MemoizedCardFooter = memo(CardFooter);

export const Route = createFileRoute('/_authLayout/login')({
  component: () => <Login />,
})

const LoginSchema = z.object({
  email: z.string().min(1, { message: "Tienes que completar este campo!" }).email("Ingresa un email valido!"),
  password: z.string().min(3, { message: "Tiene que tener al menos 3 caracteres!" }),
});

type Schema = z.infer<typeof LoginSchema>

const MemoizedFormField = memo(FormField);

function Login() {
  const { account, loading, login } = useAuth();
  const router = useRouter();

  // Memoize the form object
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    disabled: loading,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (fields: Schema) => {
    await login(fields.email, fields.password);
  };

  // Handle redirect after successful login
  useEffect(() => {
    if (account && !loading) {
      // Get redirect param from search
      const searchParams = new URLSearchParams(router.state.location.search as Record<string, string>);
      const redirectParam = searchParams.get('redirect');

      let redirectTo;

      // If there's a redirect parameter, use it
      if (redirectParam) {
        try {
          // Decode the URL parameter first
          const decodedRedirect = decodeURIComponent(redirectParam);

          // The redirect parameter should be a relative path starting with /
          if (decodedRedirect.startsWith('/')) {
            redirectTo = decodedRedirect;
          } else {
            // If it's not a valid path, fall back to default
            const accountType = account?.user?.accountType;
            redirectTo = (accountType === ACCOUNT.provider ? "/provider" : "/client") + "/dashboard";
          }
        } catch (error) {
          console.error('Invalid redirect URL:', redirectParam);
          // Fall back to default on error
          const accountType = account?.user?.accountType;
          redirectTo = (accountType === ACCOUNT.provider ? "/provider" : "/client") + "/dashboard";
        }
      } else {
        // No redirect parameter, use default
        const accountType = account?.user?.accountType;
        redirectTo = (accountType === ACCOUNT.provider ? "/provider" : "/client") + "/dashboard";
      }

      router.navigate({ to: redirectTo, replace: true });
    }
  }, [account, loading, router]);

  // Show loading while logging in
  if (loading) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <OverlayLoadingIndicator />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full'>
        <MemoizedCard>
          <MemoizedCardHeader>
            <div className='h-24 flex flex-col justify-center'>
              <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
                Ingresa a tu cuenta
              </h2>
              <p className='text-muted text-sm md:text-base'>Ingresa tu email y contraseña para ingresar a tu cuenta</p>
            </div>
          </MemoizedCardHeader>
          <MemoizedCardBody className='w-full flex justify-center m-auto h-auto relative'>
            {loading &&
              <OverlayLoadingIndicator />
            }
            <div className='w-2/4 space-y-8'>
              <MemoizedFormField
                control={form.control as unknown as Control<FieldValues>}
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
              <MemoizedFormField
                control={form.control as unknown as Control<FieldValues>}
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
                    <Button className='-ml-3' variant="link" type="button">
                      Recuperar Contraseña
                    </Button>
                  </Link>
                </p>

              </div>
            </div>
          </MemoizedCardBody>
          <MemoizedCardFooter>
            <div className='flex flex-col-reverse md:flex-row justify-between items-center min-h-24'>
              <p className='text-sm text-muted'>
                No tenes una cuenta?{' '}
                <Link to="/registration" disabled={loading}>
                  <Button className='-ml-3' variant="link" type="button" disabled={loading}>
                    Registrate
                  </Button>
                </Link>
              </p>
              <Button disabled={loading} className='min-w-[200px]' type="submit">
                {loading ? <LoadingIndicator className="w-4 h-4 text-primary-foreground" /> : 'Ingresar'}
              </Button>
            </div>
          </MemoizedCardFooter>
        </MemoizedCard>
      </form>
    </Form>
  );
}


