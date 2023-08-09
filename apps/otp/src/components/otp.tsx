import { FC, useRef } from "react";
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputProps,
} from "react-native";

export type OTPValue = Array<string>;

type OTPInputProps = {
  length: number;
  value: OTPValue;
  onChange: (otp: OTPValue) => void;
} & Omit<TextInputProps, "value" | "onChange">;

const OTPInput: FC<OTPInputProps> = ({ length, value, onChange, ...props }) => {
  const inputRefs = useRef<TextInput[] | null>([]);

  const handleValueChange = (text: string, index: number) => {
    const newValue = value.map((item, valueIndex) => {
      if (valueIndex === index) return text;
      return item;
    });

    onChange(newValue);
  };

  const handleInputChange = (value: string, index: number) => {
    handleValueChange(value, index);

    if (!inputRefs.current) return;

    if (index < length - 1) inputRefs.current[index + 1]?.focus();
    // If it's the last input, make sure to maintain focus
    else inputRefs.current[index]?.focus();
  };

  const handleBackspace = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key === "Backspace") handleInputChange("", index);
  };

  return (
    <View className="flex-row justify-between space-x-2">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          className="w-12 h-12 border rounded-lg text-center"
          ref={(ref) =>
            ref && inputRefs.current && !inputRefs.current.includes(ref)
              ? (inputRefs.current = [...inputRefs.current, ref])
              : null
          }
          maxLength={1}
          keyboardType="decimal-pad"
          contextMenuHidden
          selectTextOnFocus
          onChangeText={(value) => handleInputChange(value, index)}
          onKeyPress={(value) => handleBackspace(value, index)}
          {...props}
        />
      ))}
    </View>
  );
};

export default OTPInput;
