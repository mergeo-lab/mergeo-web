import { z } from 'zod';

const LastSellSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  userId: z.string(),
  orderNumber: z.number(),
  dropZoneId: z.string(),
  totalPrice: z.number(),
});

const BestMonthSellSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  userId: z.string(),
  orderNumber: z.number(),
  dropZoneId: z.string(),
  totalPrice: z.number(),
});

const SellInfoResponseSchema = z.object({
  lastSell: LastSellSchema,
  bestMonthSell: BestMonthSellSchema,
});

const BestZoneResponseSchema = z.object({
  dropZoneId: z.string(),
  zoneName: z.string(),
  totalRevenue: z.number(),
  percentageOfSales: z.number(),
  totalProductsSold: z.number(),
});

const ChartDataSchema = z.object({
  month: z.number(),
  total: z.number(),
});

const BestMonthSchema = z.object({
  month: z.number(),
  total: z.number(),
});

const SalesChartSchema = z.object({
  chartData: z.array(ChartDataSchema),
  totalPeriod: z.number(),
  averageMonthly: z.number(),
  growth: z.number(),
  bestMonth: BestMonthSchema,
});

export const UserPerformanceSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  closedOrders: z.number(),
  percentage: z.number(),
});

const TopSelledProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalSold: z.number(),
  revenue: z.number(),
});

export const ProductsStatsSchema = z.object({
  allProducts: z.number(),
  activeProducts: z.number(),
  topSelledProducts: z.array(TopSelledProductSchema),
});

const OrderSchema = z.object({
  id: z.string(),
  created: z.string(),
  preOrderNumber: z.number(),
  responseDeadline: z.string(),
  totalPrice: z.number(),
  productsCount: z.number(),
  dropZoneName: z.string(),
});

const PendingOrdersSchema = z.array(OrderSchema);

// Infer TypeScript type from the schema
export type SellInfoResponseType = z.infer<typeof SellInfoResponseSchema>;
export type BestZoneResponseType = z.infer<typeof BestZoneResponseSchema>;
export type SalesChartType = z.infer<typeof SalesChartSchema>;
export type UserPerformanceType = z.infer<typeof UserPerformanceSchema>;
export type TopSelledProductType = z.infer<typeof TopSelledProductSchema>;
export type ProductsStatsType = z.infer<typeof ProductsStatsSchema>;
export type PendingOrdersType = z.infer<typeof PendingOrdersSchema>;
