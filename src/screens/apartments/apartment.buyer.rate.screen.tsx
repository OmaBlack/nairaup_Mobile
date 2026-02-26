import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "src/components/themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "src/components/buttons.components";
import { Input } from "src/components/inputs.components";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons } from "@expo/vector-icons";
import useRate from "src/hooks/apis/useRating";

export default function ApartmentRateBuyerScreen({
  navigation,
  route,
}: RootStackScreenProps<"ApartmentRateBuyerScreen">) {
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState("");

  const { loading, rateUser } = useRate();

  const doRate = async () => {
    const req = await rateUser({
      note,
      recipientid: route.params.id,
      rating,
    });
    if (req.code === 201) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.mainContentStyle}>
        <Text
          mt={fontUtils.h(40)}
          mb={fontUtils.h(20)}
          size={fontUtils.h(15)}
          fontFamily={fontUtils.manrope_medium}
        >
          How would you rate this buyer?
        </Text>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          {[
            {
              label: "Very bad",
              value: 1,
            },
            {
              label: "Bad",
              value: 2,
            },
            {
              label: "Fair",
              value: 3,
            },
            {
              label: "Good",
              value: 4,
            },
            {
              label: "Very good",
              value: 5,
            },
          ].map((r) => (
            <TouchableOpacity
              key={r.label}
              style={styles.ratingViewStyle}
              onPress={() => setRating(r.value)}
            >
              <Ionicons
                name="star"
                size={fontUtils.h(50)}
                color={r.value <= rating ? "#FBBC05" : "#E2E8F0"}
              />
              <Text mt={fontUtils.h(5)} size={fontUtils.h(12)}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text mt={fontUtils.h(60)} fontFamily={fontUtils.manrope_medium}>
          Kindly leave a review for this buyer
        </Text>
        <Input
          value={note}
          onChangeText={setNote}
          multiline
          inputHeight={fontUtils.h(120)}
          maxLength={200}
        />
      </View>
      <Button title={"Done"} onPress={doRate} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: fontUtils.h(40),
  },
  mainContentStyle: {
    flex: 1,
  },
  ratingViewStyle: {
    alignItems: "center",
  },
});
