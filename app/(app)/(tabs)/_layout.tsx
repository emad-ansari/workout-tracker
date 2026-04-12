import { HapticTab } from "@/components/haptic-tab";
import { useUser } from "@clerk/expo";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

export default function TabLayout() {
	const { user } = useUser();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarButton: HapticTab,
				headerStyle: {},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Feather name="home" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="exercises"
				options={{
					title: "Exercises",
					tabBarIcon: ({ color, size }) => (
						<Feather name="book" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="workout"
				options={{
					title: "Workout",
					tabBarIcon: ({ color, size }) => (
						<Feather name="plus-circle" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="active-workout"
				options={{
					title: "Active Workout",
					href: null,
					tabBarStyle: {
						display: "none",
					},
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "History",
					tabBarIcon: ({ color, size }) => (
						<Feather name="clock" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => <ProfileTabBarIcon color={color} size={size} />,
				}}
			/>
		</Tabs>
	);
}

function ProfileTabBarIcon({ color, size }: { color: string; size: number }) {
	const { user } = useUser();
	const profileImage = user?.externalAccounts?.[0]?.imageUrl || user?.imageUrl;

	if (profileImage) {
		return (
			<Image
				source={{ uri: profileImage }}
				style={{
					width: 26,
					height: 26,
					borderRadius: 13,
					borderWidth: 1,
					borderColor: color,
				}}
			/>
		);
	}

	return <Feather name="user" color={color} size={size} />;
}
