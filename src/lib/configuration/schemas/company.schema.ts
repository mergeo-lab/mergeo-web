import { RegisterCompanySchema } from '@/lib/auth/schema';
import * as z from 'zod';

export const CompanySchema = RegisterCompanySchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CompanySchemaType = z.infer<typeof CompanySchema>;
