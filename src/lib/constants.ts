export enum ACCOUNT {
  client = 'CLIENT',
  provider = 'PROVIDER',
}

export const colorClasses = [
  'bg-primary',
  'bg-highlight',
  'bg-secondary-background',
  'bg-info',
  'bg-coaccent-foreground',
];

export enum ReplacementCriteria {
  BEST_PRICE_SAME_UNIT = 'best_price_same_unit',
  SAME_PRICE_SAME_UNIT = 'same_price_same_unit',
  SAME_PRODUCT_ANOTHER_UNIT = 'same_product_another_unit',
}

export const ReplacementCriteriaValues = {
  BEST_PRICE_SAME_UNIT: {
    value: ReplacementCriteria.BEST_PRICE_SAME_UNIT,
    label: 'Mejor precio por unidad de medida',
  },
  SAME_PRICE_SAME_UNIT: {
    value: ReplacementCriteria.SAME_PRICE_SAME_UNIT,
    label: 'Mismo precio y misma presentación',
  },
  SAME_PRODUCT_ANOTHER_UNIT: {
    value: ReplacementCriteria.SAME_PRODUCT_ANOTHER_UNIT,
    label: 'Mismo producto, distinta presentación',
  },
};
