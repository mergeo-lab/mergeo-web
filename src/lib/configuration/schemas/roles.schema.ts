import * as z from 'zod';

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

export type GroupedPermissionsSchemaType = z.infer<
  typeof GroupedPermissionsSchema
>;
export type PermissionSchemaType = z.infer<typeof PermissionSchema>;
export type RoleSchemaType = z.infer<typeof RoleSchema>;
