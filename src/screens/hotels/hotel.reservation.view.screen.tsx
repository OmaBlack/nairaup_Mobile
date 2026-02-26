import React, { useRef, useState } from "react";
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
import { Modalize } from "react-native-modalize";
import { NetworkResponse } from "src/types/request.types";

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
  const [pin, setPIN] = useState("");
  const modalRef = useRef<Modalize>(null);
  const [checkType, setCheckType] = useState<"checkin" | "checkout" | null>(
    null,
  );

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
          Toast.show({
            type: "error",
            text1: "Payment",
            text2: "Error occured during payment",
            useModal: true,
          });
        },
      });
  };

  const doAction = () => {
    if (checkType === "checkin") doCheckIn();
    else doCheckOut();
  };

  const checkInOutDone = (req: NetworkResponse) => {
    if (checkType === "checkin") setCheckedIn(true);
    else setCheckedOut(true);
    if (req.code === 200) {
      modalRef.current?.close();
      setPIN("");
      setCheckType(null);
    }
    if (req.code === 404) {
      Alert.alert(
        "PIN",
        req.message + "\nWould you like to create a PIN now?",
        [
          {
            text: "Cancel",
            style: "destructive",
          },
          {
            text: "Yes",
            isPreferred: true,
            style: "default",
            onPress: () => navigation.navigate("PinEditScreen"),
          },
        ],
      );
    }
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
          const req = await checkInOut(
            data.id,
            {
              type: "checkout",
              pin,
            },
            propertyId,
          );
          checkInOutDone(req);
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
          const req = await checkInOut(
            data.id,
            {
              type: "checkin",
              pin,
            },
            propertyId,
          );
          checkInOutDone(req);
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
              label="Checkin Date"
              date={new Date(data?.checkindatetime)}
              disabled
              wrapperStyle={[
                styles.dateWrapperStyle,
                { marginRight: fontUtils.w(5) },
              ]}
            />
            <DateTimeInput
              label="Checkin Time"
              date={new Date(data?.checkindatetime)}
              disabled
              wrapperStyle={[
                styles.dateWrapperStyle,
                { marginLeft: fontUtils.w(5) },
              ]}
              mode="time"
              format="hh:mm a"
            />
          </View>
          <View style={[layoutConstants.styles.rowView]}>
            <DateTimeInput
              label="Checkout Date"
              date={new Date(data?.checkoutdatetime)}
              disabled
              wrapperStyle={[
                styles.dateWrapperStyle,
                { marginRight: fontUtils.w(5) },
              ]}
            />
            <DateTimeInput
              label="Checkout Time"
              date={new Date(data?.checkoutdatetime)}
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
                onPress={() => {
                  setCheckType("checkin");
                  modalRef.current?.open();
                }}
                // loading={loading}
                disabled={checkedIn}
                wrapperStyle={{
                  flex: 1,
                  marginRight: fontUtils.w(10),
                }}
              />
              <Button
                title={"Check out"}
                onPress={() => {
                  setCheckType("checkout");
                  modalRef.current?.open();
                }}
                // loading={loading}
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
      <Modalize adjustToContentHeight handlePosition="inside" ref={modalRef}>
        <View style={styles.modalContentstyle}>
          <Text
            mb={fontUtils.h(15)}
            fontFamily={fontUtils.manrope_medium}
          >{`Enter your security pin to ${checkType === "checkin" ? "check in" : "check out"}`}</Text>
          <Input
            placeholder="Security PIN"
            label="Enter security PIN"
            secureTextEntry
            value={pin}
            onChangeText={setPIN}
            textAlign="center"
            maxLength={4}
          />
          <Button
            mt={fontUtils.h(20)}
            children="Continue"
            onPress={doAction}
            loading={loading}
          />
        </View>
      </Modalize>
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
  modalContentstyle: {
    paddingHorizontal: layoutConstants.mainViewHorizontalPadding,
    paddingTop: fontUtils.h(30),
    paddingBottom: fontUtils.h(30),
  },
});
