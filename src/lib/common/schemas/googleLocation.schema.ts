import * as z from 'zod';

export const GoogleLocationSchema = z.object({
  id: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  displayName: z.object({
    text: z.string(),
  }),
});

export const LocationSchema = z.object({
  id: z.string(),
  polygon: z.object({
    type: z.string(),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  name: z.string(),
});

export const LocationSchemaResponse = z.object({ data: LocationSchema });
export type LocationSchemaResponseType = z.infer<typeof LocationSchemaResponse>;
export type LocationSchemaType = z.infer<typeof LocationSchema>;

export const GoogleLocationSchemaResponse = z.object({
  data: GoogleLocationSchema,
});
export type GoogleLocationSchemaResponseType = z.infer<
  typeof LocationSchemaResponse
>;
export type GoogleLocationSchemaType = z.infer<typeof GoogleLocationSchema>;
