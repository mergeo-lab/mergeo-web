import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CryptoJS from 'crypto-js';
import { HourSlot } from '@/types';
import { ZoneSchemaPostGisType } from '@/lib/schemas';

const secretKey = import.meta.env.VITE_SEARCH_PARAMS_KEY;

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
