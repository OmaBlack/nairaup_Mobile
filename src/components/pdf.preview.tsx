import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Dimensions, View, Platform } from "react-native";
import { Modalize } from "react-native-modalize";
import Pdf, { Source } from "react-native-pdf";
import fontUtils, { deivceWidth, deviceHeight } from "src/utils/font.utils";
import { ScrollView, Text, TouchableOpacity } from "./themed.components";
import { colorDanger } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";

const PDFPreview = ({
  source,
  modalRef,
  onClose = () => null,
}: {
  source: Source;
  modalRef: any;
  onClose?: any;
}) => {
  return (
    <Modalize withReactModal ref={modalRef} withHandle={false}>
      <ScrollView
        style={{
          height: deviceHeight,
        }}
      >
        <TouchableOpacity onPress={onClose} style={styles.btnClose}>
          <Text color={colorDanger}>Close</Text>
          <Ionicons name="close" color={colorDanger} size={fontUtils.h(25)} />
        </TouchableOpacity>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdfViewStyle}
        />
      </ScrollView>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  pdfViewStyle: {
    flex: 1,
    height: Platform.select({
      ios: deviceHeight,
      android: deviceHeight - fontUtils.h(100),
    }),
    width: deivceWidth,
  },
  btnClose: {
    marginTop: fontUtils.h(15),
    marginBottom: fontUtils.h(10),
    alignSelf: "flex-end",
    right: layoutConstants.mainViewHorizontalPadding,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PDFPreview;
