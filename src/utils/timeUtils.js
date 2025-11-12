/**
 * Utility functions for handling UTC and local time conversions
 * All times are stored in UTC in the backend and converted to local time for display
 */

/**
 * Get current UTC time as ISO string
 * @returns {string} ISO string of current UTC time
 */
export const getCurrentUtcTime = () => {
  return new Date().toISOString();
};

/**
 * Convert UTC ISO string to local time string for display
 * @param {string} utcIsoString - UTC time as ISO string
 * @param {string} locale - Locale string (e.g., 'en-US', 'ar-EG')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted local time string
 */
export const utcToLocalTime = (utcIsoString, locale = 'en-US', options = {}) => {
  if (!utcIsoString) return "—";
  
  // Ensure the string is treated as UTC by adding 'Z' if it's not present
  // This handles cases where the API returns UTC time without the 'Z' suffix
  let utcString = utcIsoString;
  if (typeof utcString === 'string' && !utcString.endsWith('Z') && !utcString.includes('+') && !utcString.includes('-', 10)) {
    // If it's an ISO string without timezone info, assume it's UTC
    utcString = utcString.endsWith('Z') ? utcString : utcString + 'Z';
  }
  
  const date = new Date(utcString);
  if (Number.isNaN(date.getTime())) {
    // Fallback: try parsing as-is
    const fallbackDate = new Date(utcIsoString);
    if (Number.isNaN(fallbackDate.getTime())) return "—";
    const fallbackOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      ...options
    };
    return fallbackDate.toLocaleTimeString(locale, fallbackOptions);
  }
  
  const defaultOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...options
  };
  
  // Debug logging in development
  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    console.log('UTC to Local Time Conversion:', {
      input: utcIsoString,
      processed: utcString,
      localTime: date.toLocaleTimeString(locale, defaultOptions),
      utcHours: date.getUTCHours(),
      localHours: date.getHours(),
      timezoneOffset: date.getTimezoneOffset(),
    });
  }
  
  return date.toLocaleTimeString(locale, defaultOptions);
};

/**
 * Convert UTC ISO string to local date string for display
 * @param {string} utcIsoString - UTC time as ISO string
 * @param {string} locale - Locale string (e.g., 'en-US', 'ar-EG')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted local date string
 */
export const utcToLocalDate = (utcIsoString, locale = 'en-US', options = {}) => {
  if (!utcIsoString) return "—";
  
  const date = new Date(utcIsoString);
  if (Number.isNaN(date.getTime())) return "—";
  
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  };
  
  return date.toLocaleDateString(locale, defaultOptions);
};

/**
 * Convert UTC ISO string to local date and time string for display
 * @param {string} utcIsoString - UTC time as ISO string
 * @param {string} locale - Locale string (e.g., 'en-US', 'ar-EG')
 * @returns {string} Formatted local date and time string
 */
export const utcToLocalDateTime = (utcIsoString, locale = 'en-US') => {
  if (!utcIsoString) return "—";
  
  const date = new Date(utcIsoString);
  if (Number.isNaN(date.getTime())) return "—";
  
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Calculate duration between two UTC ISO strings
 * @param {string} startUtcIso - Start time as UTC ISO string
 * @param {string} endUtcIso - End time as UTC ISO string (optional, defaults to now)
 * @returns {number} Duration in seconds
 */
export const calculateDurationFromUtc = (startUtcIso, endUtcIso = null) => {
  if (!startUtcIso) return 0;
  
  const start = new Date(startUtcIso);
  const end = endUtcIso ? new Date(endUtcIso) : new Date();
  
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }
  
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
};

/**
 * Check if a UTC date is today in local timezone
 * @param {string} utcIsoString - UTC time as ISO string
 * @returns {boolean} True if the date is today
 */
export const isUtcDateToday = (utcIsoString) => {
  if (!utcIsoString) return false;
  
  const utcDate = new Date(utcIsoString);
  if (Number.isNaN(utcDate.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const localDate = new Date(utcDate);
  localDate.setHours(0, 0, 0, 0);
  
  return localDate.getTime() === today.getTime();
};

