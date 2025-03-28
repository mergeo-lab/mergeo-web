import { LocationSchema } from '@/lib/common/schemas/googleLocation.schema';
import { ReplacementCriteria } from '@/lib/constants';
import { CompanySchema } from '@/lib/schemas/company.schema';
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

// Define the Product schemaexport
const ProductSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  gtin: z.string(),
  name: z.string(),
  measurementUnit: z.string(),
  unitConversionFactor: z.string(),
  price: z.string(),
  pricePerBaseUnit: z.string(),
  description: z.string(),
  brand: z.string(),
  variety: z.string().optional(),
  net_content: z.number(),
  segment: z.string().optional(),
  family: z.string().optional(),
  image: z.string().optional(),
  units: z.number(),
  providerId: z.string().optional(),
  manufacturer_name: z.string().optional(),
  manufacturer_id: z.string().optional(),
  manufacturer_country: z.string().optional(),
  accepted: z.boolean().optional(),
  quantity: z.number().optional(),
  isActive: z.boolean().optional(),
  isPickUp: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  morePresentations: z.boolean().optional(),
});

// Define the PreOrderProduct schema
const PreOrderProductSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  accepted: z.boolean(),
  product: ProductSchema,
});

// Define the Criteria schema
const CriteriaSchema = z.object({
  baseMeasurementUnit: z.string(),
  id: z.string(),
  branchId: z.string(),
  replacementCriteria: z.string(),
  expectedDeliveryStartDay: z.string(),
  expectedDeliveryEndDay: z.string(),
  startHour: z.number(),
  endHour: z.number(),
  name: z.any(),
  brand: z.any(),
  isPickUp: z.boolean(),
  pickUpLng: z.string(),
  pickUpLat: z.string(),
  pickUpRadius: z.number(),
});

export const BuyOrderSchema = z.object({
  created: z.string().datetime(), // Ensure it's a valid date string
  updated: z.string().datetime(), // Ensure it's a valid date string
  id: z.string().uuid(), // UUID format for 'id'
  orderNumber: z.number(), // Assuming it's an integer number
});

// Define the PreOrder schema
export const PreOrderSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  buyOrder: BuyOrderSchema,
  preOrderNumber: z.number(),
  buyerId: z.string(),
  status: z.string(),
  instance: z.number(),
  responseDeadline: z.string(),
  preOrderProducts: z.array(PreOrderProductSchema), // An array of PreOrderProduct
  provider: CompanySchema, // Assuming this is already defined elsewhere
  criteria: CriteriaSchema,
  client: CompanySchema.optional(),
});

const User = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const ClientDelivery = CompanySchema.omit({ branches: true }).extend({
  deliveryAddress: LocationSchema,
  address: LocationSchema,
  user: User,
});

const ProviderCompany = CompanySchema.omit({ branches: true }).extend({
  address: LocationSchema,
  user: User,
});

export const OrderSchema = z.object({
  created: z.string(),
  id: z.string(),
  orderNumber: z.number(),
  products: z.array(PreOrderProductSchema), // An array of PreOrderProduct
  provider: ProviderCompany, // Assuming this is already defined elsewhere
  client: ClientDelivery,
});

// Define the TypeScript type
export type PreOrderProductSchemaType = z.infer<typeof PreOrderProductSchema>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type PreOrderSchemaType = z.infer<typeof PreOrderSchema>;

export type OrderSchemaType = z.infer<typeof OrderSchema>;
export type ProviderType = z.infer<typeof ProviderCompany>;
export type ClientType = z.infer<typeof ClientDelivery>;
