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

const ChartSchema = z.object({
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
  dropZoneName: z.string().optional(),
  status: z.string().optional(),
});

const DashboardOrdersSchema = z.array(OrderSchema);

// CLIENT
const BranchSchema = z.object({
  branchId: z.string(),
  branchName: z.string(),
  orderCount: z.number(),
  percent: z.number(),
});

const TopBranchSchema = z.object({
  branchId: z.string(),
  branchName: z.string(),
  orderCount: z.number(),
  percentage: z.number(),
  preOrderCount: z.number(),
  approvalPercent: z.number(),
});

const DashboardBranchSchema = z.object({
  branches: z.array(BranchSchema),
  topBranch: TopBranchSchema,
});

const ListCountSchema = z.object({
  title: z.string(),
  count: z.number(),
  type: z.string(),
});
const DashboardListCountSchema = z.array(ListCountSchema);

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  measurementUnit: z.string(),
  netContent: z.string(),
});

const MostBuyedProductSchema = z.object({
  product: ProductSchema,
  totalBuyed: z.number(),
  spent: z.number(),
});

const TotalBuyedProductsSchema = z.object({
  week: z.number(),
  month: z.number(),
  year: z.number(),
});

export const ClientProductsStatsSchema = z.object({
  totalBuyedProducts: TotalBuyedProductsSchema,
  mostBuyedProducts: z.array(MostBuyedProductSchema),
});

// Infer TypeScript type from the schema
export type SellInfoResponseType = z.infer<typeof SellInfoResponseSchema>;
export type BestZoneResponseType = z.infer<typeof BestZoneResponseSchema>;
export type ChartDataType = z.infer<typeof ChartSchema>;
export type UserPerformanceType = z.infer<typeof UserPerformanceSchema>;
export type TopSelledProductType = z.infer<typeof TopSelledProductSchema>;
export type ProductsStatsType = z.infer<typeof ProductsStatsSchema>;
export type DashboardOrdersType = z.infer<typeof DashboardOrdersSchema>;

//CLIENT
export type DashboardBranchType = z.infer<typeof DashboardBranchSchema>;
export type DashboardListCountType = z.infer<typeof DashboardListCountSchema>;
export type ClientProductsStatsType = z.infer<typeof ClientProductsStatsSchema>;
