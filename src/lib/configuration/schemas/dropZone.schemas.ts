import { LocationPolygonSchema } from '@/lib/common/schemas';
import { PickUpSchedulesSchema } from '@/lib/configuration/schemas/pickUp.schema';
import * as z from 'zod';

export const DropZoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Ingresa un nombre!' }),
  schedules: PickUpSchedulesSchema.array(),
  address: LocationPolygonSchema.superRefine((address, ctx) => {
    console.log('Address validation triggered:', address);

    // Ensure both id and name exist
    if (!address.id || !address.name) {
      ctx.addIssue({
        path: ['name'],
        code: z.ZodIssueCode.custom,
        message: 'El nombre de la dirección y su ID son obligatorios',
      });
    }

    // Validate that polygon is a valid array of coordinates for a polygon
    if (!address.polygon || !Array.isArray(address.polygon.coordinates)) {
      ctx.addIssue({
        path: ['polygon', 'coordinates'],
        code: z.ZodIssueCode.custom,
        message: 'Las coordenadas deben ser un array de puntos',
      });
    } else if (address.polygon.coordinates.length < 3) {
      ctx.addIssue({
        path: ['polygon', 'coordinates'],
        code: z.ZodIssueCode.custom,
        message: 'Un polígono debe tener al menos tres coordenadas',
      });
    } else if (
      !address.polygon.coordinates.every(
        (coord) =>
          Array.isArray(coord) &&
          coord.length === 2 &&
          coord.every((c) => typeof c === 'number')
      )
    ) {
      ctx.addIssue({
        path: ['polygon', 'coordinates'],
        code: z.ZodIssueCode.custom,
        message:
          'Cada coordenada debe ser un array de dos números válidos (latitud, longitud)',
      });
    }
  }),
});

export type DropZoneSchemaType = z.infer<typeof DropZoneSchema>;
