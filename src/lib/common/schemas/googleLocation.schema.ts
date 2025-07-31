import * as z from 'zod';

export const LatLngLiteral = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type LatLngLiteralType = z.infer<typeof LatLngLiteral>;

export const GoogleLocationSchema = z.object({
  location: LatLngLiteral,
  displayName: z.object({
    text: z.string(),
  }),
});

export const GoogleAddressSchema = z.object({
  id: z.string().optional(),
  location: LatLngLiteral,
  name: z.string(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
});

export const LocationSchema = z.object({
  id: z.string().optional(),
  location: z.object({
    type: z.string(),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  name: z.string().min(1, { message: 'La dirección es obligatoria' }),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
});

export const ZoneLocationSchema = z.object({
  id: z.string(),
  polygon: z.object({
    type: z.string(),
    coordinates: z.array(LatLngLiteral),
  }),
  name: z.string(),
});

export const LocationSchemaResponse = LocationSchema;
export type LocationSchemaResponseType = z.infer<typeof LocationSchemaResponse>;
export type LocationSchemaType = z.infer<typeof LocationSchema>;

export type GoogleLocationSchemaResponseType = z.infer<
  typeof LocationSchemaResponse
>;
export type GoogleLocationSchemaType = z.infer<typeof GoogleLocationSchema>;

export type ZoneLocationSchemaType = z.infer<typeof ZoneLocationSchema>;
