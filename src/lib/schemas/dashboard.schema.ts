import { z } from 'zod';

const _LastSellSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  userId: z.string(),
  orderNumber: z.number(),
  dropZoneId: z.string(),
  totalPrice: z.number(),
});

const _BestMonthSellSchema = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  userId: z.string(),
  orderNumber: z.number(),
  dropZoneId: z.string(),
  totalPrice: z.number(),
});

const _SellInfoResponseSchema = z.object({
  lastSell: _LastSellSchema,
  bestMonthSell: _BestMonthSellSchema,
});

const _BestZoneResponseSchema = z.object({
  dropZoneId: z.string(),
  zoneName: z.string(),
  totalRevenue: z.number(),
  percentageOfSales: z.number(),
  totalProductsSold: z.number(),
});

const _ChartDataSchema = z.object({
  month: z.number(),
  total: z.number(),
});

const _BestMonthSchema = z.object({
  month: z.number(),
  total: z.number(),
});

const _ChartSchema = z.object({
  chartData: z.array(_ChartDataSchema),
  totalPeriod: z.number(),
  averageMonthly: z.number(),
  growth: z.number(),
  bestMonth: _BestMonthSchema,
});

export const UserPerformanceSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  closedOrders: z.number(),
  percentage: z.number(),
});

const _TopSelledProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalSold: z.number(),
  revenue: z.number(),
});

export const ProductsStatsSchema = z.object({
  allProducts: z.number(),
  activeProducts: z.number(),
  topSelledProducts: z.array(_TopSelledProductSchema),
});

const _OrderSchema = z.object({
  id: z.string(),
  created: z.string(),
  preOrderNumber: z.number(),
  responseDeadline: z.string(),
  totalPrice: z.number(),
  productsCount: z.number(),
  dropZoneName: z.string().optional(),
  status: z.string().optional(),
  buyOrderId: z.string().optional(),
});

const _DashboardOrdersSchema = z.array(_OrderSchema);

// CLIENT
const _BranchSchema = z.object({
  branchId: z.string(),
  branchName: z.string(),
  orderCount: z.number(),
  percent: z.number(),
});

const _TopBranchSchema = z.object({
  branchId: z.string(),
  branchName: z.string(),
  orderCount: z.number(),
  percentage: z.number(),
  preOrderCount: z.number(),
  approvalPercent: z.number(),
});

const _DashboardBranchSchema = z.object({
  branches: z.array(_BranchSchema),
  topBranch: _TopBranchSchema,
});

const _ListCountSchema = z.object({
  title: z.string(),
  count: z.number(),
  type: z.string(),
});
const _DashboardListCountSchema = z.array(_ListCountSchema);

const _ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  measurementUnit: z.string(),
  netContent: z.string(),
});

const _MostBuyedProductSchema = z.object({
  product: _ProductSchema,
  totalBuyed: z.number(),
  spent: z.number(),
});

const _TotalBuyedProductsSchema = z.object({
  week: z.number(),
  month: z.number(),
  year: z.number(),
});

export const ClientProductsStatsSchema = z.object({
  totalBuyedProducts: _TotalBuyedProductsSchema,
  mostBuyedProducts: z.array(_MostBuyedProductSchema),
});

// Infer TypeScript type from the schema
export type SellInfoResponseType = z.infer<typeof _SellInfoResponseSchema>;
export type BestZoneResponseType = z.infer<typeof _BestZoneResponseSchema>;
export type ChartDataType = z.infer<typeof _ChartSchema>;
export type UserPerformanceType = z.infer<typeof UserPerformanceSchema>;
export type TopSelledProductType = z.infer<typeof _TopSelledProductSchema>;
export type ProductsStatsType = z.infer<typeof ProductsStatsSchema>;
export type DashboardOrdersType = z.infer<typeof _DashboardOrdersSchema>;

//CLIENT
export type DashboardBranchType = z.infer<typeof _DashboardBranchSchema>;
export type DashboardListCountType = z.infer<typeof _DashboardListCountSchema>;
export type ClientProductsStatsType = z.infer<typeof ClientProductsStatsSchema>;
