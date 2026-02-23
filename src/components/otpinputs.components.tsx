import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  TextInput,
  Text,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleProp,
  ViewStyle,
  Platform,
  TextStyle,
  TextInputProps,
  KeyboardTypeOptions,
  TouchableWithoutFeedback,
} from "react-native";
import { colorPrimary } from "src/constants/colors.constants";
import { useAppTheme } from "src/providers/theme.provider";
import fontUtils from "src/utils/font.utils";

const OtpInput = ({
  value = "",
  onChange,
  label,
  boxCount = 4,
  containerStyle = {},
  inputStyle = {},
  textStyle = {},
  otherProps = {},
  itemSpacing = fontUtils.w(5),
  boxHeight = fontUtils.w(54),
  boxWidth = fontUtils.w(60),
  errorMessage,
  hasError,
  disabled,
  maskInput,
  keyboardType = Platform.OS === "android"
    ? "number-pad"
    : "numbers-and-punctuation",
}: {
  value: string;
  onChange?: (t: string) => void;
  label?: string;
  boxCount?: 4 | 6;
  otherProps?: TextInputProps;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  itemSpacing?: number;
  boxHeight?: number;
  boxWidth?: number;
  errorMessage?: string;
  keyboardType?: KeyboardTypeOptions;
  hasError?: boolean;
  disabled?: boolean;
  maskInput?: boolean;
}) => {
  const { theme } = useAppTheme();

  const ref = useRef;

  let refs: any[];
  refs = [];
  let i = 0;
  while (i < boxCount) {
    refs.push(ref<TextInput>(null));
    i++;
  }

  const _otp = useMemo(() => {
    return value;
  }, [value]);

  const [otp, setOtp] = useState<string[]>(
    value.split("") || Array<string>(refs.length).fill(""),
  );

  useEffect(() => {
    setOtp(_otp.split(""));
  }, [_otp]);

  const handleOtpChange = useCallback(
    (otp: string[]) => {
      if (onChange) {
        const otpV = otp.join("");
        onChange(otpV);
      }
    },
    [onChange],
  );

  function handleOnChange(e: string, index: number) {
    const updateOtp = [...otp];
    updateOtp[index] = e[0] || "";
    setOtp(updateOtp);
    handleOtpChange(updateOtp);
    if (index < refs.length + 1 && e) {
      const newIndex = index + 1;
      if (refs[newIndex]) {
        refs[newIndex].current?.focus();
      }
    }
  }

  function handleOnKeyPress(
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) {
    if (e.nativeEvent.key === "Backspace") {
      if (index > 0 && otp[index]?.length === undefined) {
        const newIndex = index - 1;
        refs[newIndex].current?.focus();
      }
    }
  }

  function renderBox(ref: React.RefObject<TextInput>, index: number) {
    const value = otp[index];
    return (
      <TouchableWithoutFeedback
        disabled={disabled}
        key={index}
        onPress={() => refs[index].current?.focus()}
      >
        <View
          key={index}
          style={[
            {
              height: boxHeight,
              width: boxWidth,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: fontUtils.h(5),
              marginHorizontal: fontUtils.w(itemSpacing),
              backgroundColor: "#FAFCFF",
              borderColor: hasError ? "red" : "rgba(0, 0, 0, 0.05)",
              borderWidth: fontUtils.w(1),
            },
            inputStyle,
          ]}
        >
          <TextInput
            ref={ref}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={maskInput}
            style={[
              {
                fontFamily: fontUtils.manrope_medium,
                fontSize: fontUtils.h(20),
                // width: fontUtils.w(20),
                // textAlign: "center",
                // color: hasError
                //   ? colorsConstant.error[700]
                //   : !hasError && hasError !== undefined
                //     ? colorsConstant.success[700]
                //     : theme === "light"
                //       ? appColor[theme]
                //       : colorsConstant.colorWhite,
              },
              textStyle,
              { ...otherProps },
            ]}
            allowFontScaling={false}
            maxLength={1}
            selectionColor={colorPrimary}
            selectTextOnFocus
            onKeyPress={(e) => handleOnKeyPress(e, index)}
            onChangeText={(t) => handleOnChange(t, index)}
            editable={!disabled}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return (
    <View
      style={[
        {
          alignItems: "center",
        },
        containerStyle,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {refs.map((ref, index) => renderBox(ref, index))}
      </View>
    </View>
  );
};

export default OtpInput;
