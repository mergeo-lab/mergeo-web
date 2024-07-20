import { RegisterCompanySchema } from '@/lib/auth/schema';
import * as z from 'zod';

export const CompanySchema = RegisterCompanySchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CompanySchemaType = z.infer<typeof CompanySchema>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  isActive: z.boolean(),
  created: z.string(),
  updated: z.string(),
});

export const UserSchemaResponse = z.object({
  data: UserSchema,
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserSchemaResponseType = z.infer<typeof UserSchemaResponse>;
