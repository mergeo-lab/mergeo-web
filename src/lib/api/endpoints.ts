export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
} as const;

export const USER = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  DELETE_ACCOUNT: '/user/delete-account',
} as const;

export const COMPANY = {
  REGISTER: '/company/register',
  UPDATE: '/company/update',
  DELETE: '/company/delete',
  BRANCHES: '/company/branches',
  ADD_BRANCH: '/company/branches',
  UPDATE_BRANCH: '/company/branches',
  DELETE_BRANCH: '/company/branches',
} as const;

export const DASHBOARD = {
  OVERVIEW: '/dashboard/overview',
  CLIENT_CHART: '/dashboard/client-chart',
  SALES_CHART: '/dashboard/sales-chart',
  RECENT_ACTIVITY: '/dashboard/recent-activity',
  TOP_PRODUCTS: '/dashboard/top-products',
  SALES_BY_CATEGORY: '/dashboard/sales-by-category',
  SALES_BY_BRANCH: '/dashboard/sales-by-branch',
  SALES_BY_PAYMENT: '/dashboard/sales-by-payment',
  SALES_BY_DAY: '/dashboard/sales-by-day',
  SALES_BY_MONTH: '/dashboard/sales-by-month',
  SALES_BY_YEAR: '/dashboard/sales-by-year',
} as const;

export const PRODUCTS = {
  LIST: '/products',
  CREATE: '/products',
  UPDATE: '/products',
  DELETE: '/products',
  CATEGORIES: '/products/categories',
  CREATE_CATEGORY: '/products/categories',
  UPDATE_CATEGORY: '/products/categories',
  DELETE_CATEGORY: '/products/categories',
} as const;

export const SALES = {
  LIST: '/sales',
  CREATE: '/sales',
  UPDATE: '/sales',
  DELETE: '/sales',
  DETAILS: '/sales',
  REFUND: '/sales/refund',
  CANCEL: '/sales/cancel',
  PRINT: '/sales/print',
} as const;

export const CLIENTS = {
  LIST: '/clients',
  CREATE: '/clients',
  UPDATE: '/clients',
  DELETE: '/clients',
  DETAILS: '/clients',
  SEARCH: '/clients/search',
} as const;

export const REPORTS = {
  SALES: '/reports/sales',
  PRODUCTS: '/reports/products',
  CLIENTS: '/reports/clients',
  INVENTORY: '/reports/inventory',
  EXPORT: '/reports/export',
} as const;

export const SETTINGS = {
  GENERAL: '/settings/general',
  COMPANY: '/settings/company',
  USERS: '/settings/users',
  ROLES: '/settings/roles',
  PERMISSIONS: '/settings/permissions',
  BRANCHES: '/settings/branches',
  PAYMENT_METHODS: '/settings/payment-methods',
  TAXES: '/settings/taxes',
  CURRENCIES: '/settings/currencies',
  BACKUP: '/settings/backup',
  LOGS: '/settings/logs',
} as const;
