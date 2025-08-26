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
  BEST_PRICE_FOR_UNIT_AND_PRESENTATION = 'best_price_for_unit_and_presentation',
  SAME_PRODUCT_AND_PRESENTATION = 'same_product_and_presentation',
  SAME_BRAND_AND_ITEM = 'same_brand_and_item',
  BEST_PRICE_FOR_UNIT = 'best_price_for_unit',
  NO_REPLACEMENT = 'no_replacement',
}


export const ReplacementCriteriaValues = {
  // Mejor PUM por EAN (Descripción/Variedad, Marca y Presentación)
  BEST_PRICE_FOR_UNIT_AND_PRESENTATION: {
    value: ReplacementCriteria.BEST_PRICE_FOR_UNIT_AND_PRESENTATION,
    label: 'Mismos Marca, Articulo y Presentacion (MAP)',
    service: 'bestPriceForUnitAndPresentationService',
    defaultSelected: true,
  },
  // Mejor PUM por Descripcion/Variedad y Presentacion
  SAME_PRODUCT_AND_PRESENTATION: {
    value: ReplacementCriteria.SAME_PRODUCT_AND_PRESENTATION,
    label: 'Mismos Articulo y Presentacion (AP)',
    service: 'sameProductAndPresentationService',
    defaultSelected: false,
  },
  // Mejor PUM por Descripcion/Variedad y Marca
  SAME_BRAND_AND_ITEM: {
    value: ReplacementCriteria.SAME_BRAND_AND_ITEM,
    label: 'Mismos Marca y Articulo (MA)',
    service: 'sameBrandAndItemService',
    defaultSelected: false,
  },
  // Mejor PUM por Unidad de Medida
  BEST_PRICE_FOR_UNIT: {
    value: ReplacementCriteria.BEST_PRICE_FOR_UNIT,
    label: 'Solo Mejor Precio por Unidad de Medida',
    service: 'bestPriceForUnitService',
    defaultSelected: false,
  },
  NO_REPLACEMENT: {
    value: ReplacementCriteria.NO_REPLACEMENT,
    label: 'No reemplazo',
    service: 'noReplacementService',
    defaultSelected: false,
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
  end = 'end',
}

export enum ClientPreOrderStatus {
  pending = 'pending', // Estado inicial
  processed = 'processed', // Al menos un producto está siendo procesado
  end = 'end', // Todos los productos han sido procesados
}
export enum ProductStatus {
  pending = 'pending', // Pedido original, no entró en flujo de reemplazo
  accepted = 'accepted', // Producto aceptado por algún proveedor
  processed = 'processed', // Buscando reemplazo
  notFound = 'not-found', // No se encontró reemplazo después de 4 intentos
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
