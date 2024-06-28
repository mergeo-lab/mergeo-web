import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { CardBody, CardFooter } from '@/components/card'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterCompanySchema, RegisterCompanySchemaType } from '@/lib/auth/schema'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { helpers, registerCompany } from '@/lib/auth'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import UseRegistrationStore from '@/store/registration.store'
import { useToast } from '@/components/ui/use-toast'
import { isErrorMessage, isApiResponse } from '@/lib/api/guards'
import { CompanyType } from '@/types'

export const Route = createFileRoute('/_authLayout/registration/company')({
  loader: async () => helpers("provincias", "orden=nombre&campos=id,nombre"),
  component: () => <RegisterCompany />
})

function RegisterCompany() {
  const helpersData = Route.useLoaderData();
  const router = useRouter();
  const { toast } = useToast()
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedLocality, setSelectedLocality] = useState<string>("");
  const mutation = useMutation({ mutationFn: registerCompany })
  const registrationState = UseRegistrationStore();


  const { isPending, data: municipiosData } = useQuery({
    queryKey: ['localidades', selectedProvince],
    queryFn: () => helpers("municipios", `provincia=${selectedProvince}%26orden=nombre%26aplanar=true%26campos=id,nombre%26max=1000%26exacto=true`),
    enabled: !!selectedProvince
  })
  const localidades = municipiosData?.municipios;

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
  };

  useEffect(() => {
    setSelectedLocality("");
  }, [selectedProvince]);

  const form = useForm<RegisterCompanySchemaType>({
    resolver: zodResolver(RegisterCompanySchema),
    defaultValues: {
      name: "",
      razonSocial: "",
      cuit: "",
      country: "Argentina",
      province: "",
      locality: "",
      address: "",
      activity: "",
    },
  })

  const onSubmit = async (fields: RegisterCompanySchemaType) => {

    const response = await mutation.mutateAsync({
      name: fields.name,
      razonSocial: fields.razonSocial,
      cuit: fields.cuit,
      country: fields.country,
      province: fields.province,
      locality: fields.locality,
      address: fields.address,
      activity: fields.activity,
    });

    if (isErrorMessage(response)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response,
      })
    } else if (isApiResponse<CompanyType>(response)) {
      const { data } = response.data;
      registrationState.saveCompanyId(data.companyId)

      console.log("Register company:", data)

      const redirectTo = `/registration/user`;
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='country'>Pais</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-14'>
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='province'>Provincia</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleProvinceChange(value);
                    }}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su Provincia" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {helpersData.provincias.map(({ id, nombre }: { id: string, nombre: string }) => (
                          <SelectItem key={id.toString()} value={nombre}>{nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='locality'>Partido</FormLabel>
                    <Select
                      disabled={!localidades || isPending}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedLocality(value);
                      }}
                      value={selectedLocality}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su Partido" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {localidades && localidades.map(({ id, nombre }: { id: string, nombre: string }) => (
                          <SelectItem key={id.toString()} value={nombre}>{nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-14'>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id='address'>Dirección</FormLabel>
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