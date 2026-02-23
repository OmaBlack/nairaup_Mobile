import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { useAppSelector } from "src/hooks/useReduxHooks";
import moment from "moment";
import useReservation from "src/hooks/apis/useReservation";
import { usePaystack } from "react-native-paystack-webview";
import { Toast } from "toastify-react-native";
import { SimpleImageSlider } from "@one-am/react-native-simple-image-slider";

export default function HotelReserveScreen({
  navigation,
  route,
}: RootStackScreenProps<"HotelReserveScreen">) {
  const { theme } = useAppTheme();
  const room = route.params.room;

  const { popup } = usePaystack();
  const { loading, makeReservation } = useReservation();
  const { user } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState(
    `${user.profile.firstname} ${user.profile.lastname}`,
  );
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobile);
  const [checkInDate, setCheckinDate] = useState(
    moment().format("YYYY-MM-DD hh:mm"),
  );
  const [checkOutDate, setCheckOutDate] = useState(
    moment().add(1, "day").format("YYYY-MM-DD hh:mm"),
  );
  const [time, setTime] = useState(moment().format("HH:mm:ss"));
  const [guests, setGuests] = useState("1");
  const [lengthOfStay, setLengthOfStay] = useState("1");

  const payNow = (
    amount: number,
    reference: string,
    roomTitle: string,
    hotelName: string,
    reservationid: number,
  ) => {
    popup.checkout({
      email: email,
      amount,
      reference,
      metadata: {
        reservationid,
        custom_fields: [
          {
            display_name: `Reservation for ${roomTitle} at ${hotelName}`,
            variable_name: "reservationid",
            value: reservationid,
          },
        ],
      },
      onSuccess: (res) => {
        console.log("Success:", res);
        navigation.navigate("HotelReserveSuccessScreen", {
          note: `Reservation for ${roomTitle} at ${hotelName} was successful`,
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

  const doSubmit = async () => {
    const req = await makeReservation({
      roomid: route.params.id,
      email,
      fullname: fullName,
      mobile,
      numberofguests: Number(guests),
      checkindatetime: moment(checkInDate).format("YYYY-MM-DDTHH:mm:ss"),
      checkoutdatetime: moment(checkOutDate).format("YYYY-MM-DDTHH:mm:ss"),
      numberofnights: moment(checkOutDate).diff(moment(checkInDate), "d"),
    });
    if (req.code === 201) {
      const totalPayable =
        req.data?.payment?.amount + req.data?.payment?.servicefee;
      payNow(
        totalPayable,
        req.data?.payment?.reference,
        req?.data?.room?.title,
        req?.data?.room?.property?.title,
        req?.data?.id,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imagesViewStyle}>
          <SimpleImageSlider
            data={[room.featuredimageurl, ...room?.imageurls.split(",")].map(
              (photo, index) => ({
                source: photo,
                key: index.toString(),
              }),
            )}
            imageWidth={
              deivceWidth - layoutConstants.mainViewHorizontalPadding * 2
            }
            fullScreenImageAspectRatio={1 / 1}
            imageAspectRatio={16 / 9}
            fullScreenEnabled={true}
            renderFullScreenDescription={(_, index) => (
              <Text style={{ color: "#ffffff" }}>Picture {index + 1}</Text>
            )}
          />
        </View>
        {/* <ViewableImage
          source={require("src/assets/images/sliders/splash-1b.jpg")}
          style={styles.featuredImgStyle}
        /> */}
        <View style={styles.mainContent}>
          <Text
            mt={fontUtils.h(16)}
            mb={fontUtils.h(20)}
            fontFamily={fontUtils.manrope_bold}
          >
            {room?.title}
          </Text>
          <Input
            label="Full name"
            placeholder="Your name"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input
            label="Email"
            placeholder="Your email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Phone number"
            keyboardType="phone-pad"
            placeholder="Your phone number"
            value={mobile}
            onChangeText={setMobile}
          />
          <DateTimeInput
            label="Check-in Date"
            date={new Date(checkInDate)}
            mode="datetime"
            format="MMM DD YYYY | hh:mma"
            onChange={(e: string) =>
              setCheckinDate(moment(e).format("YYYY-MM-DDTHH:mm:ss"))
            }
            wrapperStyle={[
              styles.dateWrapperStyle,
              { marginRight: fontUtils.w(5) },
            ]}
          />
          <DateTimeInput
            label="Check-out Date"
            date={new Date(checkOutDate)}
            mode="datetime"
            format="MMM DD YYYY | hh:mma"
            onChange={(e: string) =>
              setCheckOutDate(moment(e).format("YYYY-MM-DDTHH:mm:ss"))
            }
            wrapperStyle={[
              styles.dateWrapperStyle,
              { marginRight: fontUtils.w(5) },
            ]}
          />
          <View style={[layoutConstants.styles.rowView]}>
            {/* <DateTimeInput
              label="Check-in Date"
              date={new Date(date)}
              mode="datetime"
              onChange={(e: string) =>
                setDate(moment(e).format("YYYY-MM-DDTHH:mm:ss"))
              }
              wrapperStyle={[
                styles.dateWrapperStyle,
                { marginRight: fontUtils.w(5) },
              ]}
            /> */}
            {/* <DateTimeInput
              label="Time"
              date={moment().toDate()}
              onChange={(e: string) => setTime(moment(e).format("HH:mm:ss"))}
              wrapperStyle={[
                styles.dateWrapperStyle,
                { marginLeft: fontUtils.w(5) },
              ]}
              mode="time"
              format="hh:mm a"
            /> */}
          </View>
          <Input
            label="Number of guests"
            keyboardType="number-pad"
            placeholder="1"
            value={guests}
            onChangeText={setGuests}
          />
          {/* <Input
            label="Length of stay"
            keyboardType="number-pad"
            placeholder="1"
            value={lengthOfStay}
            onChangeText={setLengthOfStay}
          /> */}
          <Button
            title={"Confirm details"}
            onPress={doSubmit}
            loading={loading}
            mt={fontUtils.h(40)}
          />
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
  imagesViewStyle: {
    // borderRadius: fontUtils.r(16),
    overflow: "hidden",
  },
  featuredImgStyle: {
    width: deivceWidth,
    height: fontUtils.h(100),
  },
  dateWrapperStyle: {
    flex: 1,
  },
});
