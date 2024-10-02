import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { CardBody, CardFooter } from '@/components/card'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterCompanySchema, RegisterCompanySchemaType } from '@/lib/auth/schema'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { registerCompany } from '@/lib/auth'
import UseRegistrationStore from '@/store/registration.store'
import { useToast } from '@/components/ui/use-toast'
import { GoogleAutoComplete } from '@/components/googleAutoComplete'
import { GoogleLocationSchemaType } from '@/lib/common/schemas'

export const Route = createFileRoute('/_authLayout/registration/company')({
  component: () => <RegisterCompany />
})

function RegisterCompany() {
  const router = useRouter();
  const { toast } = useToast()
  const mutation = useMutation({ mutationFn: registerCompany })
  const registrationState = UseRegistrationStore();

  const form = useForm<RegisterCompanySchemaType>({
    resolver: zodResolver(RegisterCompanySchema),
    defaultValues: {
      name: "",
      razonSocial: "",
      cuit: "",
      address: {
        id: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        name: "",
      },
      activity: "",
    },
  })

  const onSubmit = async (fields: RegisterCompanySchemaType) => {

    const response = await mutation.mutateAsync({
      name: fields.name,
      razonSocial: fields.razonSocial,
      cuit: fields.cuit,
      address: fields.address,
      activity: fields.activity,
    });

    if (response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      })
    } else if (response.data) {
      const { data } = response.data;
      registrationState.saveCompanyId(data.companyId)

      const redirectTo = `/registration/user`;
      router.history.push(redirectTo, { replace: true });
    }
  }

  const addAddress = (address: GoogleLocationSchemaType) => {
    console.log("address:: ", address);
    form.setValue('address', {
      id: address.id,
      location: {
        type: "Point",
        coordinates: [address.location.latitude, address.location.longitude]
      },
      name: address.displayName.text
    });
  }

  return (
    <>
      <CardBody className='w-full h-full flex flex-col overflow-y-auto' >
        <FormProvider {...form}>
          <form className='space-y-8'>

            <div className='grid grid-cols-2 gap-14'>
              <FormField
                control={form.control}
                name="name"
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
                name="razonSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='razonSocial'>Razon Social</FormLabel>
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
                name="cuit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='cuit'>CUIT</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='activity'>Actividad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-14'>
              <FormField
                control={form.control}
                name="address"
                render={() => (
                  <FormItem>
                    <FormLabel id='address'>Dirección</FormLabel>
                    <GoogleAutoComplete selectedAddress={addAddress} disabled={false} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </FormProvider>
      </CardBody >
      <CardFooter className='w-full'>
        <div className='flex flex-col-reverse md:flex-row justify-between items-center min-h-20'>
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