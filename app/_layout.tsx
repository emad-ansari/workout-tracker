import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {
	Inter_400Regular,
	Inter_600SemiBold,
	useFonts,
} from "@expo-google-fonts/inter";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";

import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
	initialRouteName: "(app)",
};
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
	throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
	
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_600SemiBold,
	});

	if (!fontsLoaded) return null;

	return (
		<SafeAreaProvider>
			<ClerkProvider
				publishableKey={publishableKey}
				tokenCache={tokenCache}
			>
				<StatusBar barStyle={"dark-content"} />
				<Slot />
			</ClerkProvider>
		</SafeAreaProvider>
	);
}
