import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CardBody, CardFooter } from '@/components/card'
import PasswordInput from '@/components/passwordInput'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterUserSchema, RegisterUserSchemaType, } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import UseRegistrationStore from '@/store/registration.store'
import { useAuth } from '@/context/AuthContext'
import { PhoneInput } from '@/components/phoneInput'
import { toast } from '@/components/ui/use-toast'

export const Route = createFileRoute('/_authLayout/registration/user')({
  component: () => <RegisterUser />
})

function RegisterUser() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const registrationState = UseRegistrationStore();

  const form = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(RegisterUserSchema),
    disabled: false,
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

    console.log("registrationState :: ", fields)

    try {
      const success = await register({
        email: fields.email,
        password: fields.password,
        firstName: fields.firstName,
        lastName: fields.lastName,
        accountType: accountType,
        phoneNumber: fields.phoneNumber,
        companyId: companyId,
        roles: [],
      });
      if (success) {
        navigate({ to: '/registration/validate', replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al registrar el usuario. Por favor, intenta nuevamente.",
      });
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
                      {/* <Input {...field} /> */}
                      <PhoneInput defaultCountry="AR" countrySelectProps={{ disabled: true }} {...field} />
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
          <Button onClick={form.handleSubmit(onSubmit)} className='min-w-[200px]' type="submit">
            Continuar
          </Button>
        </div>
      </CardFooter>
    </>
  )
}