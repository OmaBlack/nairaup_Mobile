/**
 * Converts a large number (999,999+) into a string with the full unit name (million, billion, etc.).
 * Displays up to one decimal place for non-whole numbers.
 *
 * @param {number} num - The number to convert.
 * @returns {string} The formatted string with the full unit name.
 */
export function convertNumberToWords(x: number | string): string {
  const num = Number(x);
  if (isNaN(num)) return `${x}`;
  if (Math.abs(num) < 1000000) {
    // Numbers below 1 million are returned as is (or formatted as per standard locale,
    // but here we just return the string representation for simplicity).
    return num.toLocaleString();
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  // Determine the order of magnitude
  const units = [
    { value: 1e12, name: "trillion" },
    { value: 1e9, name: "billion" },
    { value: 1e6, name: "million" },
  ];

  for (const unit of units) {
    if (absNum >= unit.value) {
      const scaled = absNum / unit.value;
      let displayValue: string;

      if (scaled === Math.floor(scaled)) {
        // If it's a whole number (e.g., 2 million), show without a decimal.
        displayValue = scaled.toFixed(0);
      } else {
        // Otherwise, show with one decimal place (e.g., 3.5 million).
        displayValue = scaled.toFixed(1);
      }

      return `${sign}${displayValue} ${unit.name}`;
    }
  }

  // Fallback for numbers greater than or equal to 1 million but not caught above (shouldn't happen with the current units)
  return num.toLocaleString();
}
/**
 *
 * Shortens a large number to a user-friendly format (e.g., 1000 -> 1k+, 1200 -> 1.2k, 1100000 -> 1.1M).
 * * Rules:
 * - Numbers <= 100 are returned as strings without modification.
 * - Numbers > 1000 display with 'k' suffix.
 * - Numbers > 1,000,000 display with 'M' suffix.
 * - Uses one decimal place if the number is not a clean multiple (e.g., 1.1k vs 1k).
 *
 * @param {number} num - The number to shorten.
 * @returns {string} The shortened, formatted string.
 */
export function shortenNumber(x: string | number): string {
  const num = Number(x);
  if (isNaN(num)) return `${x}`;
  if (num <= 100) {
    return num.toString();
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  // Determine the order of magnitude
  const units = [
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];

  for (const unit of units) {
    if (absNum >= unit.value) {
      const scaled = absNum / unit.value;

      // Rule for numbers exactly 1000, 1000000, etc. (e.g., 1,000,000 -> 1M+)
      if (scaled === 1 && unit.symbol === "k") {
        // Special handling for exactly 1000 to be 1k+ as per your requirement.
        return `${sign}1${unit.symbol}+`;
      }

      // If the number is greater than 1000/1M but less than 1.1k/1.1M
      // we check for exact multiples of 1000/1M to apply the '+' rule.
      if (scaled < 1.1 && scaled % 1 === 0) {
        // e.g., 1000000 is 1M, 1001 is not an exact multiple of 1000, so it will fall to the next case.
        return `${sign}${scaled.toFixed(0)}${unit.symbol}`;
      }

      // General case: display with one decimal place if necessary
      const rounded = scaled.toFixed(1);

      // If the number is 1.0, show it as 1 (e.g., 1.0k -> 1k),
      // but still include the '+' for the 1k+ case handled above.
      // If it's a clean 1.0, use toFixed(0) to avoid ".0" unless it's exactly 1k or 1M.

      if (scaled === Math.floor(scaled)) {
        // For 2000, 3000, etc., display as 2k, 3k
        return `${sign}${Math.floor(scaled)}${unit.symbol}`;
      } else {
        // For 1200, 1500, etc., display as 1.2k, 1.5k
        return `${sign}${rounded}${unit.symbol}`;
      }
    }
  }

  // If the number is between 101 and 999, return as is (no shortening unit needed)
  return num.toString();
}

export function formatCurrency(num: number, toFixed: number = 2) {
  try {
    var p = num.toFixed(toFixed).split(".");
    return (
      p[0]
        .split("")
        .reverse()
        .reduce(function (acc, num, i, orig) {
          return num + (num !== "-" && i && !(i % 3) ? "," : "") + acc;
        }, "") +
      "." +
      p[1]
    );
  } catch (e) {
    console.log(e);
    return num;
  }
}
