import * as z from 'zod';
import { BranchesSchema } from '@/lib/configuration/schemas/branches.schemas';

const PickUpDaysSchema = z.object({
  id: z.string(),
  day: z.string().min(1, { message: 'Este campo es obligatorio' }),
  startHour: z.string().optional(),
  endHour: z.string().optional(),
});

export const PickUpSchema = BranchesSchema.extend({
  days: z.array(PickUpDaysSchema),
});

export type PickUpSchemaType = z.infer<typeof PickUpSchema>;
export type PickUpDaysSchemaType = z.infer<typeof PickUpDaysSchema>;
