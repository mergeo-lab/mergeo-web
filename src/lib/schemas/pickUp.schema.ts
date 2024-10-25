import * as z from 'zod';
import { BranchesSchema } from '@/lib/schemas';

export const PickUpSchedulesSchema = z.object({
  id: z.string(),
  day: z.string().min(1, { message: 'Este campo es obligatorio' }),
  startHour: z.number().optional(),
  endHour: z.number().optional(),
});

export const PickUpSchema = BranchesSchema.extend({
  schedules: PickUpSchedulesSchema.array(),
});

export type PickUpSchemaType = z.infer<typeof PickUpSchema>;
export type PickUpSchedulesSchemaType = z.infer<typeof PickUpSchedulesSchema>;
