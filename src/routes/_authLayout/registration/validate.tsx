import CountDownIndicator from '@/components/countdown';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/components/ui/use-toast';
import { otp } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { removeRegistrationStore } from '@/store/registration.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useLoaderData, useRouter } from '@tanstack/react-router'
import CryptoJS, { AES } from 'crypto-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const activationCodeKey = import.meta.env.VITE_ACTIVATION_CODE_KEY;

export const Route = createFileRoute('/_authLayout/registration/validate')({
  loader: async ({ location }) => {
    const params = new URLSearchParams(location.search);
    const verifyData = params.get('data');
    if (verifyData) {
      const decryptedData = AES.decrypt(verifyData, activationCodeKey).toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(decryptedData);
      return JSON.parse(data);
    }
    return {};
  },
  component: () => <RegistrationValidate />
})

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Tiene que tener 6 caracteres",
  }),
})


function RegistrationValidate() {
  const router = useRouter();
  const [isValidated, setIsValidated] = useState(false);
  const { activationCode: verifyCode, email: user } = useLoaderData({ from: '/_authLayout/registration/validate' })
  const mutation = useMutation({ mutationFn: otp })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await mutation.mutateAsync({
      email: user,
      code: data.code
    })

    if (response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      })
    } else if (response.data) {
      //clear sotred data used in registration process
      removeRegistrationStore();
      setIsValidated(true);
    }
  }
  const redirectToLogin = () => {
    const redirectTo = '/login';
    router.history.push(redirectTo, { replace: true });
  }

  function validateAndSubmit(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.length == 6 && val == verifyCode) {
      form.handleSubmit(onSubmit)();
    }
  }

  if (verifyCode) {

    const verifyCodes = verifyCode && verifyCode.split('');

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full space-y-6 flex flex-col items-center justify-center gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem onChange={validateAndSubmit} className="space-y-2 h-1/2 flex flex-col items-center justify-center gap-4">
                <div className="text-center text-sm flex flex-row gap-4">
                  {verifyCodes.map((char: string, index: number) => (
                    <div
                      key={index}
                      className={cn("text-muted font-black text-lg w-6", {
                        "text-primary": char === field.value.split('')[index],
                        "text-destructive": field.value.split('')[index] && char !== field.value.split('')[index],
                      })}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <div className='flex flex-col items-center'>

                  <div>
                    {!isValidated
                      ? <p>Ingrese el codido que aparece arriba del campo para validar su cuenta</p>
                      : <p>Su cuenta ha sido validad con exito!</p>
                    }
                  </div>
                </div>
              </FormItem>
            )}
          />
          {!isValidated
            ? <Button type="submit">Validar cuenta</Button>
            : (
              <div className='w-1/2'>
                <CountDownIndicator
                  showTimer
                  label='Redirigiendo al Login en'
                  time={10}
                  callback={redirectToLogin}
                />
              </div>
            )
          }
          <Button variant="link" onClick={redirectToLogin}>Ir al Login</Button>
        </form>
      </Form >
    )
  }

  return <div className='w-full h-full flex justify-center items-center'>Se envió un email a tu casilla de correo haz clic en el link para validar tu cuenta!{verifyCode}</div>
}