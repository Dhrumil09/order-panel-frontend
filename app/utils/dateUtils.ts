/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a date string to DD-MM-YYYY HH:MM format
 * @param dateString - The date string to format
 * @returns Formatted date string in DD-MM-YYYY HH:MM format, or original string if parsing fails
 */
export const formatOrderDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

/**
 * Formats a date string to DD-MM-YYYY format (date only)
 * @param dateString - The date string to format
 * @returns Formatted date string in DD-MM-YYYY format, or original string if parsing fails
 */
export const formatDateOnly = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

/**
 * Formats a date string to HH:MM format (time only)
 * @param dateString - The date string to format
 * @returns Formatted time string in HH:MM format, or original string if parsing fails
 */
export const formatTimeOnly = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};
