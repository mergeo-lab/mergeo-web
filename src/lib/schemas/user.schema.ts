import { RoleSchema } from '@/lib/schemas';
import * as z from 'zod';

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
  data: z.array(UserSchema),
});

export const NewUserSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: 'El nombre no es valido!' })
    .optional(),
  lastName: z.string().min(3, { message: 'Ingresa tu apellido' }).optional(),
  email: z
    .string()
    .min(3, { message: 'Tienes que completar este campo!' })
    .email('Ingresa un email valido!')
    .optional(),
});

export const DeleteUserSchema = z.object({
  email: z.string().email('Ingresa un email valido!'),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserSchemaResponseType = z.infer<typeof UserSchemaResponse>;
export type NewUserSchemaType = z.infer<typeof NewUserSchema>;
export type DeleteUserSchemaType = z.infer<typeof DeleteUserSchema>;
