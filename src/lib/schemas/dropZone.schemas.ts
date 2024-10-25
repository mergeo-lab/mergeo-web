import { PickUpSchedulesSchema } from '@/lib/schemas';
import * as z from 'zod';

const LatLngLiteralSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const PostGis = z.array(z.tuple([z.number(), z.number()]));

export const ZoneSchema = z.object({
  coordinates: z.array(LatLngLiteralSchema), // Array of LatLngLiteral objects
  type: z.string(),
});

export const ZoneSchemaPostGis = z.object({
  coordinates: z.array(PostGis), // Array of LatLngLiteral objects
  type: z.string(),
});

export const DropZoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Ingresa un nombre!' }),
  schedules: PickUpSchedulesSchema.array(),
  zone: ZoneSchema,
});

export const IncomingDropZoneSchema = DropZoneSchema.extend({
  zone: ZoneSchemaPostGis,
});

export type ZoneSchemaType = z.infer<typeof ZoneSchema>;
export type ZoneSchemaPostGisType = z.infer<typeof ZoneSchemaPostGis>;
export type DropZoneSchemaType = z.infer<typeof DropZoneSchema>;
export type IncomingDropZoneSchemaType = z.infer<typeof IncomingDropZoneSchema>;
