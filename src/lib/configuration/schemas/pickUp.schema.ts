import * as z from 'zod';
import { BranchesSchema } from '@/lib/configuration/schemas/branches.schemas';

export const PickUpSchedulesSchema = z.object({
  id: z.string(),
  day: z.string().min(1, { message: 'Este campo es obligatorio' }),
  startHour: z.string().optional(),
  endHour: z.string().optional(),
});

export const PickUpSchema = BranchesSchema.extend({
  schedules: PickUpSchedulesSchema.array(),
});

export type PickUpSchemaType = z.infer<typeof PickUpSchema>;
export type PickUpSchedulesSchemaType = z.infer<typeof PickUpSchedulesSchema>;
