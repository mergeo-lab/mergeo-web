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
  netContent: z.number(),
  segment: z.string().optional(),
  family: z.string().optional(),
  image: z.string().optional(),
  units: z.number(),
  providerId: z.string().optional(),
  company: CompanySchema.optional(),
  manufacturer_name: z.string().optional(),
  manufacturer_id: z.string().optional(),
  manufacturer_country: z.string().optional(),
  accepted: z.boolean().optional(),
  quantity: z.number().optional(),
  isActive: z.boolean().optional(),
  isPickUp: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  morePresentations: z.boolean().optional(),
  isInInventory: z.boolean().optional(),
  dropZoneId: z.string().optional(),
});

// Define the PreOrderProduct schema
const PreOrderProductSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  accepted: z.boolean(),
  product: ProductSchema,
  price: z.string(),
});

// Define the new PreOrderProduct schema for the updated format
const NewPreOrderProductSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  price: z.string(),
  accepted: z.boolean(),
  productStatus: z.string(), // Individual product status: "pending", "processed", "accepted", etc.
  delivery_date: z.string().nullable(),
  productId: z.string(),
  productName: z.string(),
  gtin: z.string(),
  measurementUnit: z.string(),
  brand: z.string(),
  variety: z.string(),
  netContent: z.string(),
  pricePerBaseUnit: z.string(),
  description: z.string(),
  segment: z.string(),
  family: z.string(),
  image: z.string().nullable(),
  units: z.number().nullable(),
  manufacturer_name: z.string(),
  manufacturer_id: z.string(),
  manufacturer_country: z.string(),
  companyId: z.string(),
  replacementCriteria: z.string(),
  buyOrderId: z.string().optional(),
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
  buyOrder: BuyOrderSchema.optional(),
  orderId: z.string().optional(),
  preOrderNumber: z.number(),
  buyerId: z.string(),
  status: z.string(),
  instance: z.number(),
  responseDeadline: z.string(),
  preOrderProducts: z.array(PreOrderProductSchema), // An array of PreOrderProduct
  provider: CompanySchema, // Assuming this is already defined elsewhere
  criteria: CriteriaSchema,
  client: CompanySchema.optional(),
  dropZoneId: z.string(),
  dropZoneName: z.string(),
  totalPrice: z.number(),
  acceptedTotalPrice: z.number(),
});

// Define the BuyOrder Summary schema for pre-orders
const BuyOrderSummarySchema = z.object({
  id: z.string(),
  buyOrderNumber: z.number(),
  status: z.string(),
  totalPrice: z.string(),
  providerName: z.string(),
  providerId: z.string(),
  createdAt: z.string(),
});

// Define the new PreOrder schema for the updated format
export const NewPreOrderSchema = z.object({
  id: z.string(),
  clientPreOrderNumber: z.number(),
  status: z.string(),
  dropZoneId: z.string(),
  totalPrice: z.string(),
  totalAcceptedPrice: z.string(),
  responseDeadline: z.string(),
  products: z.array(NewPreOrderProductSchema),
  buyOrders: z.array(BuyOrderSummarySchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
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

// Define the Provider PreOrder schema (for the nested structure)
export const ProviderPreOrderSchema = z.object({
  id: z.string(),
  preOrderNumber: z.number(),
  status: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  totalPrice: z.string(),
  responseDeadline: z.string(),
  instance: z.number(),
  products: z.array(z.any()), // Array of products
});

// Define the Client PreOrder schema (main structure) - Updated for new format
export const ClientPreOrderSchema = z.object({
  id: z.string(),
  clientPreOrderNumber: z.number(),
  status: z.string(),
  dropZoneId: z.string(),
  dropZoneName: z.string().optional(),
  totalPrice: z.string(),
  responseDeadline: z.string(),
  products: z.array(NewPreOrderProductSchema),
  buyOrders: z.array(BuyOrderSummarySchema).optional(),
  branchName: z.string().optional(),
  branchId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Define the Client PreOrders Response schema
export const ClientPreOrdersResponseSchema = z.object({
  entities: z.array(ClientPreOrderSchema),
  total: z.number(),
  count: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

// Define the TypeScript type
export type PreOrderProductSchemaType = z.infer<typeof PreOrderProductSchema>;
export type NewPreOrderProductSchemaType = z.infer<
  typeof NewPreOrderProductSchema
>;
export type BuyOrderSummarySchemaType = z.infer<typeof BuyOrderSummarySchema>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type PreOrderSchemaType = z.infer<typeof PreOrderSchema>;
export type NewPreOrderSchemaType = z.infer<typeof NewPreOrderSchema>;
export type ProviderPreOrderSchemaType = z.infer<typeof ProviderPreOrderSchema>;
export type ClientPreOrderSchemaType = z.infer<typeof ClientPreOrderSchema>;
export type ClientPreOrdersResponseSchemaType = z.infer<
  typeof ClientPreOrdersResponseSchema
>;

export type OrderSchemaType = z.infer<typeof OrderSchema>;
export type ProviderType = z.infer<typeof ProviderCompany>;
export type ClientType = z.infer<typeof ClientDelivery>;
