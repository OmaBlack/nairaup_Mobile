import React from "react";
import { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function ItemSavedIcon({
  color = "#293AA6",
}: {
  color?: ColorValue;
}) {
  return (
    <Svg width="11" height="15" viewBox="0 0 11 15" fill="none">
      <Path
        d="M1 3.36828C1 2.53938 1 2.12493 1.1635 1.80817C1.30731 1.52967 1.53677 1.30325 1.819 1.16134C2.14 1 2.56 1 3.4 1H7.6C8.44 1 8.86 1 9.181 1.16134C9.46323 1.30325 9.69269 1.52967 9.8365 1.80817C10 2.12493 10 2.53938 10 3.36828V13.2151C10 13.5748 10 13.7546 9.92425 13.8531C9.89152 13.8959 9.84975 13.9312 9.80183 13.9565C9.75392 13.9818 9.701 13.9965 9.64675 13.9996C9.5215 14.007 9.37 13.9071 9.067 13.708L5.5 11.3612L1.933 13.7073C1.63 13.9071 1.4785 14.007 1.3525 13.9996C1.29838 13.9964 1.24561 13.9816 1.19783 13.9563C1.15005 13.931 1.1084 13.8958 1.07575 13.8531C1 13.7546 1 13.5748 1 13.2151V3.36828Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
