import { FC, useRef } from "react";
import {
  View,
  TouchableOpacity,
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
} & TextInputProps;

const OTPInput: FC<OTPInputProps> = ({ length, value, onChange, ...props }) => {
  const inputRefs = useRef<TextInput[] | null>([]);
  const currentInputEl = inputRefs.current;

  const handleValueChange = (text: string, index: number) => {
    const newValue = value.map((item, valueIndex) => {
      if (valueIndex === index) return text;
      return item;
    });

    onChange(newValue);
  };

  const handleInputChange = (value: string, index: number) => {
    handleValueChange(value, index);

    if (!currentInputEl) return;
    if (value.length !== 0) return currentInputEl[index + 1]?.focus();

    return currentInputEl[index - 1]?.focus();
  };

  const handleBackspace = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (event.nativeEvent.key === "Backspace") handleInputChange("", index);
  };

  return (
    <View className="flex-row justify-between space-x-2">
      {Array.from({ length }).map((_, index) => (
        <TouchableOpacity
          key={index}
          className="w-12 h-12 border rounded-lg items-center justify-center"
        >
          <TextInput
            className="text-center"
            ref={(ref) =>
              ref && currentInputEl && !currentInputEl.includes(ref)
                ? (inputRefs.current = [...currentInputEl, ref])
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
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OTPInput;
