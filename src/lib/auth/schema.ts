import * as z from 'zod';
// TODO: Add phone number validation
export const RegisterUserSchema = z
  .object({
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
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      });
    }
  });
export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;

export const RegisterCompanySchema = z.object({
  name: z.string().min(3, { message: 'El nombre no es valido!' }),
  razonSocial: z.string().min(3, { message: 'Ingresa tu Razon Social' }),
  cuit: z
    .string()
    .min(8, { message: 'El CUIT no es valido' })
    .max(8, { message: 'El CUIT no es valido' }),
  country: z.string().min(3, { message: 'No conocemos ese pais!' }),
  province: z.string(),
  locality: z.string(),
  address: z
    .string()
    .min(6, { message: 'Tiene que tener al menos 6 caracteres!' }),
  activity: z
    .string()
    .min(6, { message: 'Tiene que tener al menos 6 caracteres!' }),
});

export type RegisterCompanySchemaType = z.infer<typeof RegisterCompanySchema>;
