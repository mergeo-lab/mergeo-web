import { z } from 'zod';

// Define Location schema
const LocationSchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number()).length(2), // Assuming it's a 2D coordinate [longitude, latitude]
});

// Define Address schema
const AddressSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  name: z.string(),
  location: LocationSchema,
});

// Define Branch schema
const BranchSchema = z.object({
  id: z.string(),
  address: AddressSchema,
});

// Define Product schema
const ProductSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  name: z.string(),
  measurementUnit: z.string(),
  unitConversionFactor: z.string(),
  price: z.string(),
  description: z.any(),
  brand: z.string(),
  variety: z.string(),
  netContent: z.number(),
  segment: z.string(),
  family: z.string(),
  image: z.string(),
  units: z.number(),
  manufacturer_name: z.string(),
  manufacturer_id: z.string(),
  manufacturer_country: z.string(),
});

// Define BuyOrderProduct schema
const BuyOrderProductSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  product: ProductSchema,
});

// Define Client and Provider schema (similar structure)
const ClientProviderSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  name: z.string(),
  razonSocial: z.string(),
  cuit: z.string(),
  activity: z.string(),
});

// Define Schedule schema
const ScheduleSchema = z.object({
  startDay: z.string(),
  endDay: z.string(),
  startHour: z.number(),
  endHour: z.number(),
});

// Define Daum schema
export const BuyOrderSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  orderNumber: z.number(),
  client: ClientProviderSchema, // Reusing ClientProviderSchema
  provider: ClientProviderSchema, // Reusing ClientProviderSchema
  buyOrderProducts: z.array(BuyOrderProductSchema),
  branch: BranchSchema,
  schedule: ScheduleSchema,
});

// Infer TypeScript type from the schema
export type BuyOrderSchemaType = z.infer<typeof BuyOrderSchema>;
