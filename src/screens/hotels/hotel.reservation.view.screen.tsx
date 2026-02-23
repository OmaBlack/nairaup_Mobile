import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "src/types/navigation.types";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ViewableImage,
} from "src/components/themed.components";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtils, { deivceWidth } from "src/utils/font.utils";
import layoutConstants from "src/constants/layout.constants";
import { DateTimeInput, Input } from "src/components/inputs.components";
import { Button } from "src/components/buttons.components";
import useReservation from "src/hooks/apis/useReservation";
import { colorSuccess } from "src/constants/colors.constants";
import { usePaystack } from "react-native-paystack-webview";
import { useAppSelector } from "src/hooks/useReduxHooks";
import { Toast } from "toastify-react-native";
import useTransaction from "src/hooks/apis/useTransactions";

export default function HotelReservationViewScreen({
  navigation,
  route,
}: RootStackScreenProps<"HotelReservationViewScreen">) {
  const { theme } = useAppTheme();
  const { email } = useAppSelector((state) => state.auth.user);
  const data = route.params.data;
  const propertyId = data?.room?.property?.id;
  const { loading, checkInOut } = useReservation();
  const { generatePaymentReference, loading: loadingRef } = useTransaction();
  const { popup } = usePaystack();
  const [checkedIn, setCheckedIn] = useState(data?.status === "ongoing");
  const [checkedOut, setCheckedOut] = useState(data?.status === "closed");

  const makePayment = async () => {
    const refRef = await generatePaymentReference({
      propertyid: data?.room?.propertyid,
    });
    if (refRef.code === 201)
      popup.checkout({
        email: email,
        amount: Number(data?.room?.price) * data?.numberofnights,
        reference: refRef.data?.reference,
        metadata: {
          reservationid: data?.id,
          custom_fields: [
            {
              display_name: `Reservation for ${data?.room?.title} at ${data?.room?.property?.title}`,
              variable_name: "reservationid",
              value: data?.id,
            },
          ],
        },
        onSuccess: (res) => {
          console.log("Success:", res);
          navigation.navigate("HotelReserveSuccessScreen", {
            note: `Reservation for ${data?.room?.title} at ${data?.room?.property?.title}`,
          });
        },
        onCancel: () =>
          Toast.show({
            type: "warn",
            text1: "Payment",
            text2: "Payment cancelled",
            useModal: true,
          }),
        onLoad: (res) => console.log("WebView Loaded:", res),
        onError: (err) => {
          console.log(err);
          Toast.show({
            type: "error",
            text1: "Payment",
            text2: "Error occured during payment",
            useModal: true,
          });
        },
      });
  };

  const doCheckOut = async () => {
    Alert.alert("Check Out", "Would you like to check out now?", [
      {
        text: "No",
        isPreferred: true,
        style: "default",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await checkInOut(
            data.id,
            {
              type: "checkout",
            },
            propertyId,
          );
          setCheckedOut(true);
        },
      },
    ]);
  };

  const doCheckIn = async () => {
    Alert.alert("Check In", "Would you like to check in now?", [
      {
        text: "No",
        isPreferred: true,
        style: "default",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await checkInOut(
            data.id,
            {
              type: "checkin",
            },
            propertyId,
          );
          setCheckedIn(true);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ViewableImage
          source={require("src/assets/images/sliders/splash-1b.jpg")}
          style={styles.featuredImgStyle}
        />
        <View style={styles.mainContent}>
          <Text
            mt={fontUtils.h(16)}
            mb={fontUtils.h(20)}
            fontFamily={fontUtils.manrope_bold}
          >
            {data?.room?.property?.title}
          </Text>
          <Input
            label="Full name"
            placeholder="Your name"
            value={data?.fullname}
            disabled
            editable={false}
          />
          <Input
            label="Email"
            placeholder="Your email"
            value={data?.email}
            disabled
            editable={false}
          />
          <Input
            label="Phone number"
            keyboardType="phone-pad"
            placeholder="Your name"
            value={data?.mobile}
            disabled
            editable={false}
          />
          <View style={[layoutConstants.styles.rowView]}>
            <DateTimeInput
              label="Date"
              date={new Date(data?.reserveddatetime)}
              disabled
              wrapperStyle={[
                styles.dateWrapperStyle,
                { marginRight: fontUtils.w(5) },
              ]}
            />
            <DateTimeInput
              label="Time"
              date={new Date(data?.reserveddatetime)}
              disabled
              wrapperStyle={[
                styles.dateWrapperStyle,
                { marginLeft: fontUtils.w(5) },
              ]}
              mode="time"
              format="hh:mm a"
            />
          </View>
          <Input
            label="Number of guests"
            keyboardType="number-pad"
            placeholder="1"
            value={data?.numberofguests}
            disabled
            editable={false}
          />
          <Input
            label="Length of stay"
            keyboardType="number-pad"
            placeholder="1"
            value={data?.numberofnights}
            disabled
            editable={false}
          />
          {data?.paymentstatus !== "paid" ? (
            <Button
              title={"Make Payment"}
              onPress={makePayment}
              loading={loadingRef}
              mt={fontUtils.h(40)}
            />
          ) : (
            <View
              style={[
                layoutConstants.styles.rowView,
                {
                  marginTop: fontUtils.h(40),
                },
              ]}
            >
              <Button
                title={"Check in"}
                onPress={doCheckIn}
                loading={loading}
                disabled={checkedIn}
                wrapperStyle={{
                  flex: 1,
                  marginRight: fontUtils.w(10),
                }}
              />
              <Button
                title={"Check out"}
                onPress={doCheckOut}
                loading={loading}
                disabled={checkedOut}
                backgroundColor={colorSuccess}
                wrapperStyle={{
                  flex: 1,
                  marginLeft: fontUtils.w(10),
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  mainContent: {
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
  },
  featuredImgStyle: {
    width: deivceWidth,
    height: fontUtils.h(100),
  },
  dateWrapperStyle: {
    flex: 1,
  },
});
