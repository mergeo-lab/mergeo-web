import { ReplacementCriteria } from '@/lib/constants';
import * as z from 'zod';

const DateRangeSchema = z.object({
  from: z.date(), // validate the "from" date
  to: z.date().optional(), // validate the "to" date
});

export const OrderConfigSchema = z.object({
  deliveryTime: DateRangeSchema,
  branchId: z.string(),
  pickUp: z.boolean(),
  pickUpLocation: z
    .object({
      radius: z.number(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    })
    .optional(),
  replaceCriteria: z.nativeEnum(ReplacementCriteria).optional(),
  listId: z.string().optional(),
  compulse: z.boolean().optional(),
});

export type OrderConfigSchemaType = z.infer<typeof OrderConfigSchema>;
