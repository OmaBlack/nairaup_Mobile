import { Dimensions } from "react-native";

export const deivceWidth = Dimensions.get("window").width;
export const deviceHeight = Dimensions.get("window").height;

const DEVICE_SCALE = Dimensions.get("window").width / 375;
const DEVICE_SCALE_HEIGHT = Dimensions.get("window").height / 768;
const space_mono = "space-mono";

const manrope_bold = "manrope-bold";
const manrope_extrabold = "manrope-extrabold";
const manrope_extralight = "manrope-extralight";
const manrope_light = "manrope-light";
const manrope_medium = "manrope-medium";
const manrope_regular = "manrope-regular";
const manrope_semibold = "manrope-semibold";

function normalize(size: number): number {
  return Math.round(DEVICE_SCALE * size);
}

export default {
  space_mono,

  manrope_bold,
  manrope_extrabold,
  manrope_extralight,
  manrope_light,
  manrope_medium,
  manrope_regular,
  manrope_semibold,

  h: (size: number): number => Math.round(DEVICE_SCALE_HEIGHT * size),
  w: normalize,
  r: normalize,
};
