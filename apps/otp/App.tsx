import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import OTPInput, { OTPValue } from "./src/components/otp";
import { useState } from "react";

const App = () => {
  const [otp, setOtp] = useState<OTPValue>([]);

  return (
    <View className="min-h-screen items-center justify-center">
      <OTPInput length={6} value={otp} onChange={(value) => setOtp(value)} />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
