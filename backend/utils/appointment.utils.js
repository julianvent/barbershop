/**
 * Sets the time portion of a date object based on a time string.
 * Takes a date and time string (HH:MM or HH:MM:SS) and returns a new date
 * with the time components replaced.
 *
 * @param {Date} date - The base date to modify
 * @param {string} timeStr - Time string in format HH:MM or HH:MM:SS (e.g., "14:30" or "14:30:45")
 * @returns {Date} A new date object with updated time, milliseconds zeroed
 *
 * Performance note: Uses single setHours() call instead of multiple setHours/setMinutes/setSeconds
 * calls to minimize date mutations (was 4 operations, now 1).
 */
export function setTimeToDate(date, timeStr) {
  
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("Invalid date provided");
  }
  
  if (typeof timeStr !== "string" || !timeStr.trim()) {
    throw new Error("Invalid time string provided");
  }

  // Parse time components using destructuring with default for optional seconds
  const [hours, minutes, seconds = "0"] = timeStr.split(":");
  const newDate = new Date(date);
  newDate.setHours(Number(hours), Number(minutes), Number(seconds), 0);
  return newDate;
}

/**
 * PERFORMANCE OPTIMIZATION: Regex pattern cached at module level
 *
 * By caching it here, we compile once and reuse the same pattern object.
 * Matches timezone offset strings like "+05:30" or "-06:00"
 */
const OFFSET_REGEX = /^([+-])(\d{2}):(\d{2})$/;

/**
 * Converts a timezone offset string to total minutes.
 * Database timezone conversions.
 *
 * @param {string} [offsetStr="-06:00"] - Offset string in format ±HH:MM (e.g., "-06:00", "+05:30")
 * @returns {number} Total offset in minutes (negative for west, positive for east)
 *
 * Examples:
 *   parseOffsetMinutes() => -360 (default)
 *   parseOffsetMinutes("+05:30") => 330
 */
export function parseOffsetMinutes(offsetStr = "-06:00") {
  
  const match = OFFSET_REGEX.exec(offsetStr);
  if (!match) throw new Error(`Invalid offset format: ${offsetStr}`);

  // Convert sign to multiplier (-1 for west, +1 for east)
  const sign = match[1] === "-" ? -1 : 1;
  // Extract hours and minutes, convert to total minutes with sign
  const offsetMinutes = sign * (Number(match[2]) * 60 + Number(match[3]));
  return offsetMinutes;
}

/**
 * PERFORMANCE OPTIMIZATION: Padding function cached at module level
 *
 * Previously, this was defined inside formatDateForTimezone() and recreated
 * on every function call. This caused:
 * - Function object allocation on each call
 * - Closure allocation for each invocation
 * - Repeated garbage collection of unused function objects
 *
 * By defining once at module level, we have a single reusable function reference.
 */
const PAD_ZERO = (value) => String(value).padStart(2, "0");

/**
 * Converts a date to a formatted string in a specific timezone offset.
 * Useful for consistent database storage and API responses.
 *
 * @param {Date|string|number} dateInput - Date to format (accepts any Date constructor argument)
 * @param {string} [offsetStr="-06:00"] - Timezone offset in format ±HH:MM (e.g., "-06:00", "+02:00")
 * @returns {string} Formatted date string "YYYY-MM-DD HH:MM:SS" adjusted to the specified timezone
 *
 * Examples:
 *   formatDateForTimezone(new Date("2024-12-02T18:00:00Z"), "-06:00")
 *   // Returns: "2024-12-02 12:00:00" (UTC-6 = 6 hours behind)
 *
 * How it works:
 * 1. Parse the timezone offset to minutes
 * 2. Create a date object from input
 * 3. Adjust the date by adding offset minutes (converts UTC to local time)
 * 4. Format using UTC getters to prevent double conversion
 */
export function formatDateForTimezone(dateInput, offsetStr = "-06:00") {
  const offsetMinutes = parseOffsetMinutes(offsetStr);
  // Create date once (optimization: avoid double new Date() calls)
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  // Adjust date by adding the offset minutes (in milliseconds)
  // This shifts UTC time to the target timezone for display
  const adjusted = new Date(date.getTime() + offsetMinutes * 60 * 1000);

  // Build formatted string with zero-padded components
  // Using string concatenation for better readability than template literals
  return (
    `${adjusted.getUTCFullYear()}-` +
    `${PAD_ZERO(adjusted.getUTCMonth() + 1)}-` +
    `${PAD_ZERO(adjusted.getUTCDate())} ` +
    `${PAD_ZERO(adjusted.getUTCHours())}:` +
    `${PAD_ZERO(adjusted.getUTCMinutes())}:` +
    `${PAD_ZERO(adjusted.getUTCSeconds())}`
  );
}
