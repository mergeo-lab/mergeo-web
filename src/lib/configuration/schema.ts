import { RegisterCompanySchema } from '@/lib/auth/schema';
import * as z from 'zod';

export const CompanySchema = RegisterCompanySchema;

export type CompanySchemaType = z.infer<typeof CompanySchema>;
