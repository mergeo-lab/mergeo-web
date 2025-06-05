import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CardBody, CardFooter } from '@/components/card'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { GoogleLocationSchemaType, RegisterCompanySchema, RegisterCompanySchemaType } from '@/lib/schemas'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { registerCompany } from '@/lib/auth'
import UseRegistrationStore from '@/store/registration.store'
import { useToast } from '@/components/ui/use-toast'
import { GoogleAutoComplete } from '@/components/googleAutoComplete'
import OverlayLoadingIndicator from '@/components/overlayLoadingIndicator'

export const Route = createFileRoute('/_authLayout/registration/company')({
  component: () => <RegisterCompany />
})

function RegisterCompany() {
  const navigate = useNavigate();
  const { toast } = useToast()
  const mutation = useMutation({ mutationFn: registerCompany })
  const registrationState = UseRegistrationStore();

  const form = useForm<RegisterCompanySchemaType>({
    resolver: zodResolver(RegisterCompanySchema) as unknown as Resolver<RegisterCompanySchemaType>,
    defaultValues: {
      name: "",
      razonSocial: "",
      cuit: "",
      branch: {
        address: {
          location: {
            type: "Point",
            coordinates: [0, 0],
          },
          name: "",
        }
      },
      activity: "",
    },
  })

  const onSubmit = async (fields: RegisterCompanySchemaType) => {
    try {
      // Validate the form data
      const validationResult = RegisterCompanySchema.safeParse(fields);
      if (!validationResult.success) {
        console.error("Form validation failed:", validationResult.error);
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "Por favor, verifica todos los campos del formulario.",
        });
        return;
      }
      // Remove id field from branch.address
      const response = await mutation.mutateAsync({
        name: fields.name,
        razonSocial: fields.razonSocial,
        cuit: fields.cuit,
        branch: fields.branch,
        activity: fields.activity,
      });

      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        })
      } else if (response.companyId) {
        registrationState.saveCompanyId(response.companyId)
        navigate({ to: '/registration/user', replace: true });
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al registrar la empresa. Por favor, intenta nuevamente.",
      });
    }
  }

  const addBranch = (address: GoogleLocationSchemaType) => {
    form.setValue('branch.address', {
      location: {
        type: "Point",
        coordinates: [address.location.latitude, address.location.longitude]
      },
      name: address.displayName.text
    });
  }

  return (
    <>
      <CardBody className='w-full h-full flex flex-col overflow-y-auto relative' >
        {mutation.isPending && <OverlayLoadingIndicator />}
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
                      <Input {...field} maxLength={11} />
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
                name="branch.address"
                render={() => (
                  <FormItem>
                    <FormLabel id='branch.address'>Dirección de la Sucursal</FormLabel>
                    <GoogleAutoComplete selectedAddress={addBranch} disabled={false} />
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
          <Button
            disabled={mutation.isPending || !form.formState.isValid}
            onClick={form.handleSubmit(onSubmit)}
            className='min-w-[200px]'
            type="submit">
            Continuar
          </Button>
        </div>
      </CardFooter>
    </>
  )
}
