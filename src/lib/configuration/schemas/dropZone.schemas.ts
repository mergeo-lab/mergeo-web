import { PickUpSchedulesSchema } from '@/lib/configuration/schemas/pickUp.schema';
import * as z from 'zod';

const LatLngLiteralSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ZoneSchema = z.object({
  polygon: z.object({
    coordinates: z.array(LatLngLiteralSchema), // Array of LatLngLiteral objects
    type: z.string(),
  }),
});

export const DropZoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Ingresa un nombre!' }),
  schedules: PickUpSchedulesSchema.array(),
  zone: ZoneSchema,
});

export type ZoneSchemaType = z.infer<typeof ZoneSchema>;
export type DropZoneSchemaType = z.infer<typeof DropZoneSchema>;
