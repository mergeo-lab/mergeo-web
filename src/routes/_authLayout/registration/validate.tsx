import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/registration/validate')({
  component: () => <RegistrationValidate />
})

function RegistrationValidate() {
  return <div className='w-full h-full flex justify-center items-center'>Se envió un email a tu casilla de correo haz clic en el link para validar tu cuenta!</div>
}