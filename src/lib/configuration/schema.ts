import { RegisterCompanySchema } from '@/lib/auth/schema';
import * as z from 'zod';

export const CompanySchema = RegisterCompanySchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CompanySchemaType = z.infer<typeof CompanySchema>;

export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  action: z.string(),
  hasPermission: z.boolean(),
});

export const GroupedPermissionsSchema = z.object({
  group: z.string(),
  create: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
});

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  companyId: z.string(),
  permissions: z.array(PermissionSchema),
  created: z.date(),
  updated: z.date(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(RoleSchema),
  isActive: z.boolean(),
  created: z.string(),
  updated: z.string(),
});

export const UserSchemaResponse = z.object({
  data: UserSchema,
});

export const NewUserSchema = z.object({
  firstName: z.string().min(3, { message: 'El nombre no es valido!' }),
  lastName: z.string().min(3, { message: 'Ingresa tu apellido' }),
  email: z
    .string()
    .min(3, { message: 'Tienes que completar este campo!' })
    .email('Ingresa un email valido!'),
  position: z.string().optional(),
  roles: z.array(RoleSchema),
});

export type GroupedPermissionsSchemaType = z.infer<
  typeof GroupedPermissionsSchema
>;
export type PermissionSchemaType = z.infer<typeof PermissionSchema>;
export type RoleSchemaType = z.infer<typeof RoleSchema>;
export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserSchemaResponseType = z.infer<typeof UserSchemaResponse>;
export type NewUserSchemaType = z.infer<typeof NewUserSchema>;
