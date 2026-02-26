import { StyleSheet } from "react-native";
import { Dimensions, Platform } from "react-native";
import fontUtils from "src/utils/font.utils";
import fontUtil from "src/utils/font.utils";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  rowView: {
    flexDirection: "row",
    alignItems: "center",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  uploadBtnStyle: {
    borderStyle: "dashed",
    borderWidth: fontUtils.w(1),
    width: fontUtils.w(120),
    height: fontUtils.w(74),
    borderRadius: fontUtils.r(10),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  tabBarHeight: Platform.select({
    ios: fontUtil.h(65),
    android: fontUtil.h(60),
  }),
  activeOpacity: 0.6,
  mainViewHorizontalPadding: fontUtil.w(16),
  screenWidth: width - fontUtil.w(16 * 2),
  buttonHeight: fontUtil.h(45),
  buttonRadius: fontUtil.r(5),
  inputHeight: fontUtil.h(44),
  inputRadius: fontUtil.h(5),
  styles,
  card: {
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
};
