import { LocationSchema } from '@/lib/common/schemas';
import * as z from 'zod';

export const BaseRegisterUserSchema = z.object({
  firstName: z.string().min(3, { message: 'El nombre no es valido!' }),
  lastName: z.string().min(3, { message: 'Ingresa tu apellido' }),
  email: z
    .string()
    .min(3, { message: 'Tienes que completar este campo!' })
    .email('Ingresa un email valido!'),
  phoneNumber: z
    .string()
    .min(8, { message: 'El telefono no es valido' })
    .max(20, { message: 'El telefono no es valido' }),
  password: z
    .string()
    .min(6, { message: 'Tiene que tener al menos 6 caracteres!' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Tiene que tener al menos 6 caracteres!' })
    .optional(),
  companyId: z.string().optional(),
  accountType: z.string().optional(),
});

export const RegisterUserSchema = BaseRegisterUserSchema.superRefine(
  ({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      });
    }
  }
);

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;

export const RegisterCompanySchema = z.object({
  name: z.string().min(3, { message: 'El nombre no es valido!' }),
  razonSocial: z.string().min(3, { message: 'Ingresa tu Razon Social' }),
  cuit: z
    .string()
    .min(8, { message: 'El CUIT no es valido' })
    .max(8, { message: 'El CUIT no es valido' }),
  address: LocationSchema,
  activity: z
    .string()
    .min(6, { message: 'Tiene que tener al menos 6 caracteres!' }),
});

export type RegisterCompanySchemaType = z.infer<typeof RegisterCompanySchema>;

export const OtpSchema = z.object({
  email: z
    .string()
    .min(3, { message: 'Tienes que completar este campo!' })
    .email('Ingresa un email valido!'),
  code: z.string().min(6, { message: 'El codigo deve tener 6 digitos' }),
});

export type OtpSchemaType = z.infer<typeof OtpSchema>;
