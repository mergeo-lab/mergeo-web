import * as z from 'zod';

const phoneRegex = new RegExp('^(?=.{10}$)');

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Tienes que completar este campo!' })
    .email('Ingresa un email valido!'),
  password: z
    .string()
    .min(6, { message: 'Tiene que tener al menos 6 caracteres!' }),
  phoneNumber: z.string().regex(phoneRegex, 'Numbero Invalido!'),
  firstName: z.string().min(3, { message: 'El nombre no es valido!' }),
  lastName: z.string().min(1, { message: 'Ingresa tu apellido' }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
