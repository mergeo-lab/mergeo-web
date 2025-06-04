import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router';
import Card, { CardHeader } from '@/components/card'
import Steps from '@/components/steps'

export const Route = createFileRoute('/_authLayout/registration')({
  component: () => <Registration />,
})

function Registration() {
  const steps = [
    {
      stepNumber: 1,
      link: "/registration",
      subtitle: "Elige tu tipo Cuenta"
    },
    {
      stepNumber: 2,
      link: "/registration/company",
      subtitle: "Registra una empresa para poder continuar"
    },
    {
      stepNumber: 3,
      link: "/registration/user",
      subtitle: "Ingresa tus datos para poder continuar"
    },
    {
      stepNumber: 4,
      link: "/registration/validate",
      subtitle: "Confirma tu email para terminar la registración"
    }];
  const router = useRouterState();
  const currentStep = steps.find((step) => step.link === router.location.pathname);
  return (
    <div className='w-full h-full'>
      <Card className='justify-start'>
        <CardHeader>
          <div className='h-24 flex flex-col justify-center'>
            <h2 className="text-2xl md:text-3xl font-black text-secondary-background pb-2">
              Crear una Cuenta
            </h2>
            <p className='text-muted text-sm md:text-base'>
              {currentStep?.subtitle}
            </p>
          </div>
          {currentStep?.stepNumber !== 1 &&
            <Steps
              className='my-4'
              steps={["Datos de Empresa", "Datos de usuario", "Validar Cuenta"]}
              current={currentStep && currentStep?.stepNumber - 1 || 1}
            />
          }
        </CardHeader>
        <Outlet />
      </Card>
    </div>
  )
}