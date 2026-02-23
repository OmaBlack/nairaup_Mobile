export const colorPrimary = "#0452C0";

export const colorWhite = "#FFFFFF";

export const colorSuccess = "#34A853";

export const colorDanger = "#F24747";

function convertToRgba(color: string, alpha = 1) {
  if (!color) return "#000";
  // Regular expressions to check for rgb(a) strings
  const rgbaPattern =
    /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d*(?:\.\d+)?))?\)$/;

  // Check if the input is already an rgb(a) string
  const rgbaMatch = color?.match(rgbaPattern);

  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    // Use the provided alpha or default to 1 if not present
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // If not rgb(a), assume it's a hex color
  // Remove the leading '#' if present
  color = color?.replace(/^#/, "");

  // Check for shorthand hex code and expand it
  if (color.length === 3) {
    color = color
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse the hex values to get red, green, and blue components
  const bigint = parseInt(color, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return the RGBA string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const interpolate = (start: number, end: number, value: number) => {
  let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
  return Math.ceil((1 - k) * start + k * end) % 256;
};

export const colorRedToGreen = (v: number) => {
  let r = interpolate(255, 0, v);
  let g = interpolate(0, 255, v);
  let b = interpolate(0, 0, v);
  return `rgb(${r},${g},${b})`;
};

export default {
  light: {
    text: "#2E3131",
    background: "#FFFFFF",
    screenGb: "#FFFFFF",
  },
  dark: {
    text: "#FFF",
    background: "#000000",
    screenGb: "#000000",
  },
  convertToRgba,
};
