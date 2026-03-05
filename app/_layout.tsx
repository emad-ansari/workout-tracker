import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
	anchor: "(tabs)",
};
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
	throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<SafeAreaView className="flex-1">
				<ClerkProvider
					publishableKey={publishableKey}
					tokenCache={tokenCache}
				>
					<StatusBar style="dark" />
					<Slot />;
				</ClerkProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
