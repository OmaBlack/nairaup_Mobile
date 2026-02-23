import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Image, Text } from "./themed.components";
import fontUtils from "src/utils/font.utils";
import { Button } from "./buttons.components";
import layoutConstants from "src/constants/layout.constants";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./apartments.components";
import { useNavigation } from "@react-navigation/native";
import { ProfileObjectType } from "src/types/app.types";
import { UserStatusType } from "src/types/user.types";

export const ServiceProvidersItem = ({
  profile,
  wrapperStyle,
}: {
  profile: ProfileObjectType & {
    user: {
      id: number;
      email: string;
      mobile: string;
      status: UserStatusType;
    };
  };
  wrapperStyle?: StyleProp<ViewStyle>;
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.listingViewStyle, wrapperStyle]}>
      <View style={styles.viewMainStyle}>
        <View>
          <Image
            source={{
              uri: profile.avatarurl,
            }}
            style={styles.imageStyle}
          />
          <Image
            source={require("src/assets/images/icons/stash_save-ribbon.png")}
            style={styles.ribbonStyle}
            wrapperStyle={styles.ribbontWrapperStyle}
          />
        </View>
        <View
          style={[
            layoutConstants.styles.rowView,
            layoutConstants.styles.justifyContentBetween,
          ]}
        >
          <Text
            size={fontUtils.h(12)}
            fontFamily={fontUtils.manrope_bold}
            mt={fontUtils.h(5)}
            numberOfLines={1}
          >
            {`${profile.firstname} ${profile.lastname}`}
          </Text>
          <Text size={fontUtils.h(8)} mb={fontUtils.h(5)} mt={fontUtils.h(5)}>
            <Ionicons name="star" color="#FBBC05" />
            {` 5.0`}
          </Text>
        </View>
        <Text size={fontUtils.h(10)}>{profile.profession}</Text>
      </View>
      <Button
        title={"View Portfolio"}
        onPress={() =>
          navigation.navigate("ProviderViewScreen", {
            profile,
          })
        }
        type="outline"
        titleStyle={styles.btnTitleStyle}
        buttonHeight={fontUtils.h(35)}
        wrapperStyle={styles.btnWrapperStyle}
      />
    </View>
  );
};
