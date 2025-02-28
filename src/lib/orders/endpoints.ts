import { API_BASE } from '../api/config';

export const SEARCH_PRODUCTS = `${API_BASE}/product/company`;

export const PRE_ORDER = `${API_BASE}/preorder`;

export const ORDERS_EVENTS = `${API_BASE}/server-sent-events/client/`;

export const ORDERS_EVENTS_PROVIDER = `${API_BASE}/server-sent-events/provider/`;

export const BUY_ORDER = `${API_BASE}/buy-order`;

export const PRODUCT_UPLOAD_EVENTS = `${API_BASE}/server-sent-events/provider/productUpload/`;
