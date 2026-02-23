import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@rneui/themed";
import React, { useMemo } from "react";
import { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  Text,
  TouchableOpacity,
  ViewableImage,
} from "src/components/themed.components";
import { colorPrimary } from "src/constants/colors.constants";
import layoutConstants from "src/constants/layout.constants";
import { useAppTheme } from "src/providers/theme.provider";
import { ProfileObjectType } from "src/types/app.types";
import fontUtils from "src/utils/font.utils";

export const Rating = ({
  value = 3.5,
  size = fontUtils.h(8),
  color,
  reviews,
  containerStyle = {},
}: {
  value?: number;
  size?: number;
  color?: string;
  reviews?: string;
  containerStyle?: StyleProp<ViewStyle>;
}) => {
  const { theme } = useAppTheme();

  const renderStars = useMemo(() => {
    const stars = [];
    const roundedRating = Math.round(value);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i.toString()}
          name={"star"}
          type="antdesign"
          size={size}
          color={i <= roundedRating ? (color ? color : "#F5D066") : "#E3DADD"}
          style={{
            marginRight: fontUtils.w(3),
          }}
        />,
      );
    }

    return stars;
  }, [value]);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
        },
        containerStyle,
      ]}
    >
      {renderStars}
    </View>
  );
};

export const ReviewItem = memo(function ReviewItem({
  note,
  id,
  profile,
  cleanlinessrating,
  customerservicerating,
  hospitalityrating,
  profileid,
  rating,
  recipient,
  recipientid,
}: {
  note: string;
  id: number;
  profileid?: number;
  recipientid?: number;
  rating?: number;
  hospitalityrating?: number;
  customerservicerating?: number;
  cleanlinessrating?: number;
  profile: Partial<ProfileObjectType>;
  recipient?: Partial<ProfileObjectType>;
}) {
  return (
    <TouchableOpacity style={[styles.wrapperStyle]}>
      <ViewableImage
        source={{
          uri: profile?.avatarurl,
        }}
        style={styles.imageStyle}
      />
      <View style={styles.contentStyle}>
        <View style={styles.reviewViewStyle}>
          <Text size={fontUtils.h(11)} mt={fontUtils.h(4)}>
            {note}
          </Text>
        </View>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          <View style={layoutConstants.styles.rowView}>
            <Ionicons name="ellipse" size={fontUtils.h(5)} color="black" />
            <Text size={fontUtils.h(10)} ml={fontUtils.w(4)}>
              {`${profile.firstname} ${profile.lastname}`}
            </Text>
          </View>
          <Rating value={rating} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  wrapperStyle: {
    marginBottom: fontUtils.h(10),
    flexDirection: "row",
    paddingHorizontal: fontUtils.w(10),
    paddingVertical: fontUtils.h(4),
    backgroundColor: "#FAFCFF",
  },
  contentStyle: {
    flex: 1,
    marginLeft: fontUtils.w(12),
  },
  imageStyle: {
    borderRadius: fontUtils.r(8),
    height: fontUtils.w(70),
    width: fontUtils.w(93),
  },
  reviewViewStyle: {
    flex: 1,
  },
});
