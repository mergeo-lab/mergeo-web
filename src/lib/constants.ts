export enum ACCOUNT {
  client = 'CLIENT',
  provider = 'PROVIDER',
}

export enum tabs {
  company = 'company',
  users = 'users',
}

export enum ConfigTabs {
  COMPANY = 'company',
  USER = 'user',
}

export enum BackLinkType {
  LINK = 'link',
  BUTTON = 'button',
}

export enum BackLinkArrowPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export const colorClasses = [
  'bg-primary',
  'bg-highlight',
  'bg-secondary-background',
  'bg-info',
  'bg-coaccent-foreground',
];

export const ActivityType: Record<string, { type: string; classname: string }> =
  {
    CREATED: { type: 'CREADO', classname: 'bg-info text-white font-bold' },
    UPDATED: {
      type: 'MODIFICADO',
      classname: 'bg-highlight font-bold text-white',
    },
    DELETED: { type: 'BORRADO', classname: 'destructive' },
  };

export enum ReplacementCriteria {
  BEST_PRICE_FOR_UNIT = 'best_price_for_unit',
  SAME_BRAND_AND_ITEM = 'same_brand_and_item',
  SAME_PRODUCT_AND_PRESENTATION = 'same_product_and_presentation',
  BEST_PRICE_FOR_UNIT_AND_PRESENTATION = 'best_price_for_unit_and_presentation',
  NO_REPLACEMENT = 'no_replacement',
}

export const ReplacementCriteriaValues = {
  // Mejor PUM por EAN (Descripción/Variedad, Marca y Presentación)
  BEST_PRICE_FOR_UNIT: {
    value: ReplacementCriteria.BEST_PRICE_FOR_UNIT,
    label: 'Mejor precio por unidad de medida',
  },
  // Mejor PUM por Descripcion/Variedad y Marca
  SAME_BRAND_AND_ITEM: {
    value: ReplacementCriteria.SAME_BRAND_AND_ITEM,
    label: 'Mismos marca y producto',
  },
  // Mejor PUM por Descripcion/Variedad y Presentacion
  SAME_PRODUCT_AND_PRESENTATION: {
    value: ReplacementCriteria.SAME_PRODUCT_AND_PRESENTATION,
    label: 'Mismos producto y presentación',
  },
  // Mejor PUM por Unidad de Medida
  BEST_PRICE_FOR_UNIT_AND_PRESENTATION: {
    value: ReplacementCriteria.BEST_PRICE_FOR_UNIT_AND_PRESENTATION,
    label: 'Mejor precio por unidad de medida y presentación',
  },
  NO_REPLACEMENT: {
    value: ReplacementCriteria.NO_REPLACEMENT,
    label: 'No quiero reemplazo',
  },
};

export enum PRE_ORDER_STATUS {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
  partialyAccepted = 'partialy-accepted',
  timeout = 'timeout',
  fail = 'fail',
  processed = 'processed',
}

export enum SERVER_SENT_EVENTS {
  preOrderCreated = 'preOrder.created',
  preOrderRejected = 'preOrder.rejected',
  preOrderFail = 'preOrder.fail',
  orderCreated = 'order.created',
  productsUploadSuccess = 'products.upload.success',
  productsUploadFail = 'products.upload.fail',
  productsUploadSummary = 'products.upload.summary',
}

export const SERVER_SENT_EVENT = 'sse.event';
