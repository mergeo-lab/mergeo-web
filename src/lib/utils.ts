import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as CryptoJS from 'crypto-js';
import { HourSlot } from '@/types';
import { ZoneSchemaPostGisType } from '@/lib/schemas';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReplacementCriteria, ReplacementCriteriaValues } from './constants';
import { GoogleLocationSchemaType, LocationSchemaType } from '@/lib/schemas';

const secretKey = import.meta.env.VITE_SEARCH_PARAMS_KEY;

export enum NotificationType {
  PRE_ORDER_CREATED = 'pre_order_created',
  PRE_ORDER_UPDATED = 'pre_order_updated',
  BUY_ORDER_CREATED = 'buy_order_created',
  BUY_ORDER_UPDATED = 'buy_order_updated',
  ORDER_STATUS_CHANGED = 'order_status_changed',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  DELIVERY_SCHEDULED = 'delivery_scheduled',
  DELIVERY_COMPLETED = 'delivery_completed',
  DELIVERY_FAILED = 'delivery_failed',
  SYSTEM_NOTIFICATION = 'system_notification',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encryptQueryParam(param: string): string {
  return CryptoJS.AES.encrypt(param, secretKey).toString();
}

export function decryptQueryParam(encryptedParam: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedParam, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function formatDate(dateString: string, shortFormat = false): string {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();
  const monthNumber = date.getMonth() + 1;

  if (shortFormat) return `${day}/${monthNumber}/${year}`;
  return `${day} de ${month} del ${year}`;
}

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');

  return { firstName, lastName };
}

export function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  // Sort and compare arrays
  return (
    arr1.length === arr2.length &&
    arr1.sort().join(',') === arr2.sort().join(',')
  );
}

export function generateHourSlots(max: number): HourSlot[] {
  const hours: HourSlot[] = [];

  for (let i = 1; i < max + 1; i++) {
    const hour = i < 10 ? `0${i}:00` : `${i}:00`;
    hours.push({
      name: hour + ' hs',
      value: hour,
    });
  }

  return hours;
}

export function transformPolygonToGeoJSON(
  coordinates: google.maps.LatLngLiteral[]
): ZoneSchemaPostGisType {
  const transformedCoordinates: [number, number][] = coordinates.map(
    (c: google.maps.LatLngLiteral): [number, number] => [c.lng, c.lat] // Explicitly return a tuple
  );

  // Return the transformed polygon
  return {
    coordinates: [transformedCoordinates],
    type: 'Polygon',
  };
}

export function transformToLatLng(
  coordinates: [number, number][][]
): google.maps.LatLngLiteral[] {
  // Check if coordinates exist and are valid
  if (!coordinates || !coordinates[0] || coordinates[0].length === 0) {
    // Return center of Argentina as default
    return [
      { lat: -34.6118, lng: -58.396 }, // Buenos Aires
      { lat: -34.6118, lng: -58.396 }, // Buenos Aires
      { lat: -34.6118, lng: -58.396 }, // Buenos Aires
      { lat: -34.6118, lng: -58.396 }, // Buenos Aires
    ];
  }

  // Flatten the array and transform each [lng, lat] to { lat, lng }
  return coordinates[0].map((pair: [number, number]) => ({
    lat: pair[1], // lat is the second element
    lng: pair[0], // lng is the first element
  }));
}

// Transforms string "07:00 to number 7000"¸
export function timeStringToNumber(timeString: string): number {
  // Split the time string by the colon
  const [hours, minutes] = timeString.split(':');

  // Convert hours and minutes to integers
  const hoursInt = parseInt(hours, 10);
  const minutesInt = parseInt(minutes, 10);

  // Return the number in the format HHMM
  return hoursInt * 100 + minutesInt;
}

export function numberToTimeString(time: number | undefined): string {
  if (!time) return '00:00';
  // Extract hours and minutes
  const hours = Math.floor(time / 100);
  const minutes = time % 100;

  // Pad hours and minutes with leading zeros if necessary, then return the time string
  const hoursString = hours.toString().padStart(2, '0');
  const minutesString = minutes.toString().padStart(2, '0');

  return `${hoursString}:${minutesString}hs`;
}

/**
 * Formats a number as Argentinian Pesos (ARS).
 * @param amount - The number to format.
 * @param options - Optional settings for formatting.
 * @returns A string formatted as Argentinian Pesos.
 */
export function formatToArgentinianPesos(
  amount: number,
  options?: Intl.NumberFormatOptions
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat('es-AR', {
    ...defaultOptions,
    ...options,
  }).format(amount);
}

export function pagination(current: number, total: number) {
  const center = [current - 2, current - 1, current, current + 1, current + 2],
    filteredCenter = center.filter((p) => p > 1 && p < total),
    includeThreeLeft = current === 5,
    includeThreeRight = current === total - 4,
    includeLeftDots = current > 5,
    includeRightDots = current < total - 4;

  if (includeThreeLeft) filteredCenter.unshift(2);
  if (includeThreeRight) filteredCenter.push(total - 1);

  if (includeLeftDots) filteredCenter.unshift(-1);
  if (includeRightDots) filteredCenter.push(-1);

  return [1, ...filteredCenter, total];
}

export function getTimeRemaining(isoDate: string): string {
  const targetDate = parseISO(isoDate);
  return formatDistanceToNowStrict(targetDate, { addSuffix: true, locale: es }); // e.g., "in 3 days", "in 5 hours"
}

// Helper function to safely convert to date string
export const getDateString = (
  dateValue: Date | undefined,
  format: 'iso' | 'locale' = 'locale'
) => {
  if (!dateValue) return undefined;
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (isNaN(date.getTime())) return undefined;

  if (format === 'iso') {
    return date.toISOString().split('T')[0];
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }
};

/**
 * Get the display label for a replacement criteria
 */
export function getReplacementCriteriaLabel(
  criteria: ReplacementCriteria
): string {
  const key = Object.keys(ReplacementCriteriaValues).find(
    (k) =>
      ReplacementCriteriaValues[k as keyof typeof ReplacementCriteriaValues]
        .value === criteria
  );
  return key
    ? ReplacementCriteriaValues[key as keyof typeof ReplacementCriteriaValues]
        .label
    : 'Criterio no válido';
}

/**
 * Check if a replacement criteria is a custom one (not the default)
 */
export function isCustomReplacementCriteria(
  criteria: ReplacementCriteria | undefined
): boolean {
  return (
    criteria !== undefined && criteria !== ReplacementCriteria.NO_REPLACEMENT
  );
}

/**
 * Get the default replacement criteria
 */
export function getDefaultReplacementCriteria(): ReplacementCriteria {
  const defaultOption = Object.values(ReplacementCriteriaValues).find(option => option.defaultSelected);
  return defaultOption ? defaultOption.value : ReplacementCriteria.BEST_PRICE_FOR_UNIT;
}

// Location conversion utilities
export function googleLocationToLocation(
  googleLocation: GoogleLocationSchemaType
): LocationSchemaType {
  return {
    location: {
      type: 'Point',
      coordinates: [
        googleLocation.location.longitude,
        googleLocation.location.latitude,
      ],
    },
    name: googleLocation.displayName.text,
  };
}

export function locationToGoogleLocation(
  location: LocationSchemaType
): GoogleLocationSchemaType {
  return {
    location: {
      latitude: location.location.coordinates[1],
      longitude: location.location.coordinates[0],
    },
    displayName: {
      text: location.name,
    },
  };
}
