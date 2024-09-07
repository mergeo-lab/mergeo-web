import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CryptoJS from 'crypto-js';
import { HourSlot } from '@/types';

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

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();

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
