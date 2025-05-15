import * as z from 'zod';

export const LatLngLiteral = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type LatLngLiteralType = z.infer<typeof LatLngLiteral>;

export const GoogleLocationSchema = z.object({
  id: z.string(),
  location: LatLngLiteral,
  displayName: z.object({
    text: z.string(),
  }),
});

export const LocationSchema = z.object({
  id: z.string(),
  location: z.object({
    type: z.string(),
    coordinates: z.tuple([
      LatLngLiteral.shape.longitude,
      LatLngLiteral.shape.latitude,
    ]),
  }),
  name: z.string(),
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
