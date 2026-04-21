import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WorkoutPage = () => {
	const router = useRouter();

	const startWorkout = () => {
		// navigate to active workout screen.
		router.push("/active-workout");
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<View className="flex-1 bg-gray-50">
				{/* Main start workout screen */}
				<View className="flex-1 px-6">
					{/* Header */}
					<View className="pt-8 pb-6">
						<Text className="text-2xl font-bold text-gray-900 mb-2 ">
							Ready to Train?
						</Text>
						<Text className="text-md text-gray-500 font-sans">
							Start your workout session
						</Text>
					</View>
				</View>

				{/* Generic start workout card */}
				<View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mx-6 mb-8">
					<View className="flex-row items-center justify-between mb-6">
						<View className="flex-row items-center">
							<View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
								<Ionicons
									name="fitness"
									size={24}
									color="#3B82F6"
								/>
							</View>
							<View>
								<Text className="text-lg font-semibold text-gray-900">
									Start Workout
								</Text>
								<Text className="text-gray-500 text-base font-sans">
									Begin your training session
								</Text>
							</View>
						</View>
						<View className="bg-green-100 px-3 py-1 rounded-full">
							<Text className="text-green-700 font-medium text-sm">
								Ready
							</Text>
						</View>
					</View>

					<TouchableOpacity
						className="bg-blue-500 rounded-2xl py-4 items-center"
						activeOpacity={0.8}
						onPress={startWorkout}
					>
						<View className="flex-row items-center gap-2">
							<Ionicons
								name="play-circle-outline"
								size={24}
								color="white"
							/>
							<Text className="text-white font-semibold text-lg">
								Start Workout
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default WorkoutPage;
