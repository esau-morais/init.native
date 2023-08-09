import { StatusBar } from "expo-status-bar";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import OTPInput, { OTPValue } from "./src/components/otp";
import { useState } from "react";

const App = () => {
  const [otp, setOtp] = useState<OTPValue>(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyOTP = async () => {
    try {
      setIsVerifying(true);

      const response = await fetch("http://localhost:3000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // turn it dynamic
          email: "me@emots.dev",
          otp: otp.join(""),
        }),
      });

      const data = await response.json();
      console.info({ data });

      if (response.ok) {
        Alert.alert("Success", "OTP verified successfully.");
        setOtp(Array(6).fill(""));
      } else {
        Alert.alert("Error", "Failed to verify OTP.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View className="min-h-screen items-center justify-center">
      <OTPInput
        length={6}
        value={otp}
        onChange={(value: OTPValue) => setOtp(value)}
      />
      <TouchableOpacity
        className="mt-4 bg-black p-4 rounded-lg"
        onPress={handleVerifyOTP}
        disabled={isVerifying}
      >
        <Text className="text-white text-lg">Verify OTP</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
