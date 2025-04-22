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

// Infer TypeScript type from the schema
export type SellInfoResponseType = z.infer<typeof SellInfoResponseSchema>;
export type BestZoneResponseType = z.infer<typeof BestZoneResponseSchema>;
export type SalesChartType = z.infer<typeof SalesChartSchema>;
