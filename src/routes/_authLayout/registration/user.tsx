import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { CardBody, CardFooter } from '@/components/card'
import LoadingIndicator from '@/components/loadingIndicator'
import PasswordInput from '@/components/passwordInput'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { RegisterUserSchema, RegisterUserSchemaType, } from '@/lib/auth/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm, FormProvider } from 'react-hook-form'
import { registerUser } from '@/lib/auth'
import UseRegistrationStore from '@/store/registration.store'

export const Route = createFileRoute('/_authLayout/registration/user')({
  component: () => <RegisterUser />
})

function RegisterUser() {
  const router = useRouter();
  const { toast } = useToast();
  const userMutation = useMutation({ mutationFn: registerUser });
  const registrationState = UseRegistrationStore();

  const form = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(RegisterUserSchema),
    disabled: userMutation.isPending,
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (fields: RegisterUserSchemaType) => {
    const companyId = registrationState.companyId ? registrationState.companyId : "";
    const accountType = registrationState.accountType ? registrationState.accountType : "";

    console.log("registrationState :: ", registrationState)

    const response = await userMutation.mutateAsync({
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      password: fields.password,
      phoneNumber: fields.phoneNumber,
      companyId: companyId,
      accountType: accountType,
    });

    if (response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: Array.isArray(response.error) ? response.error[0] : response.error,
      })
    } else if (response.data) {
      registrationState.saveUserEmail(fields.email);

      const redirectTo = '/registration/validate';
      router.history.push(redirectTo, { replace: true });
    }
  }

  return (
    <>
      <CardBody className='w-full h-full flex flex-col justify-center' >
        <FormProvider {...form}>
          <form className='space-y-8'>
            <div className='grid grid-cols-2 gap-14'>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='name'>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='lastName'>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-14'>
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='phoneNumber'>Numero de Telefono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-14'>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='confirmPassword'>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <PasswordInput fieldName={field.name} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </FormProvider>
      </CardBody >
      <CardFooter className='w-full'>
        <div className='flex flex-col-reverse md:flex-row justify-between items-center min-h-24'>
          <p className='text-sm text-muted'>
            ya tenes una cuenta?{' '}
            <Link to="/login">
              <Button className='-ml-3' variant="link">
                Login
              </Button>
            </Link>
          </p>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={userMutation.isPending} className='min-w-[200px]' type="submit">
            {userMutation.isPending ? <LoadingIndicator className="w-4 h-4 text-primary-foreground" /> : 'Continuar'}
          </Button>
        </div>
      </CardFooter>
    </>
  )
}