import { useAuth } from "@clerk/expo";
import { Stack, useRouter, useSegments, type Href } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
	const { isLoaded, isSignedIn } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (!isLoaded) return;

		const stringSegments = segments as string[];
		const inTabsGroup = stringSegments.includes("(tabs)");
		const isAuthPage = stringSegments.includes("sign-in") || stringSegments.includes("sign-up") || stringSegments.includes("email-verification");
		
		// If the user is signed in and trying to access an auth page, redirect them to the home page
		if (isSignedIn && isAuthPage) {
			router.replace("/(app)/(tabs)" as Href);
		} 
		// If the user is not signed in and trying to access a protected page, redirect them to the sign-in page
		else if (!isSignedIn && inTabsGroup) {
			router.replace("/(app)/sign-in" as Href);
		}
	}, [isSignedIn, isLoaded, segments]);

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="exercise-detail"
				options={{
					headerShown: false,
					presentation: "modal",
				}}
			/>
			<Stack.Screen name="sign-in" options={{ headerShown: false }} />
			<Stack.Screen name="sign-up" options={{ headerShown: false }} />
			<Stack.Screen
				name="email-verification"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
}
