import { BranchesSchema } from '@/lib/schemas';
import * as z from 'zod';

export const CompanySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string().min(3, { message: 'El nombre no es valido!' }),
  razonSocial: z.string().min(3, { message: 'Ingresa tu Razon Social' }),
  cuit: z
    .string() // Expect string input from form
    .min(11, { message: 'CUIT debe tener 11 dígitos' }) // Ensure it has 11 characters
    .transform((val) => Number(val)) // Transform string to number
    .refine((val) => !isNaN(val), {
      message: 'CUIT debe ser un número válido',
    }),
  branches: BranchesSchema.array(),
  activity: z
    .string()
    .min(6, { message: 'Tiene que tener al menos 6 caracteres!' }),
});

export type CompanySchemaType = z.infer<typeof CompanySchema>;
