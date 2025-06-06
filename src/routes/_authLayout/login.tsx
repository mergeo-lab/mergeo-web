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
import { useEffect, memo, useState } from 'react';
import { ACCOUNT } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator';
import { useGlobalLoading } from '@/store/globalLoading.store';
import { SheetTrigger, SheetContent, SheetWithConfirm } from '@/components/ui/sheet';

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
  const { show } = useGlobalLoading();
  const [open, setOpen] = useState(false);

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

  // Get redirect param from search using router.state.location.search
  let searchString = '';
  if (typeof router.state.location.search === 'string') {
    searchString = router.state.location.search;
  } else if (router.state.location.search && typeof router.state.location.search === 'object') {
    searchString = new URLSearchParams(
      Object.entries(router.state.location.search).reduce((acc, [key, value]) => {
        acc[key] = value?.toString() ?? '';
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    if (searchString) searchString = '?' + searchString;
  }
  const searchParams = new URLSearchParams(searchString);
  const redirectParam = searchParams.get('redirect');

  const onSubmit = async (fields: Schema) => {
    await login(fields.email, fields.password);
  };

  useEffect(() => {
    if (account && !loading) {
      let redirectTo;
      if (redirectParam && redirectParam.startsWith(window.location.origin)) {
        // Absolute URL, use pathname + search only
        const url = new URL(redirectParam);
        redirectTo = url.pathname + url.search;
      } else if (redirectParam && redirectParam.startsWith('/')) {
        // Relative path, safe to use
        redirectTo = redirectParam;
      } else {
        // Fallback to default
        const accountType = account?.user?.accountType;
        redirectTo = (accountType === ACCOUNT.provider ? "/provider" : "/client") + "/dashboard";
      }
      router.history.replace(redirectTo);
    } else if (account && loading) {
      show();
    }
  }, [account, loading, router.history, show, redirectParam]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full'>
        <MemoizedCard>
          <MemoizedCardHeader>
            <>
              <div className='h-24 flex flex-col justify-center'>
                <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
                  Ingresa a tu cuenta
                </h2>
                <p className='text-muted text-sm md:text-base'>Ingresa tu email y contraseña para ingresar a tu cuenta</p>
              </div>

              <SheetWithConfirm open={open} onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setOpen(false);
                } else {
                  setOpen(isOpen);
                }
              }}>
                <SheetTrigger>
                  <Button type='button' variant="outlineSecondary" onClick={() => setOpen(true)} >
                    abrir
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-1/3 mx-w-1/3 sm:max-w-1/3">
                  Hola
                </SheetContent>
              </SheetWithConfirm>
            </>
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
                    <Button className='-ml-3' variant="link">
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
                <Link to="/registration">
                  <Button className='-ml-3' variant="link">
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


