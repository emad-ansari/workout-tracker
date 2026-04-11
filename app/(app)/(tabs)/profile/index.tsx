import { AlertModal } from "@/components/alert-modal";
import useWorkout from "@/hooks/use-workout";
import { formatDuration } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
	const { signOut } = useAuth();
	const { user } = useUser();
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const { loading, workouts, fetchWorkouts } = useWorkout();

	useEffect(() => {
		fetchWorkouts();
	}, [user?.id]);

	// Calculate stats
	const totalWorkouts = workouts.length;
	const totalDuration = workouts.reduce(
		(sum, workout) => sum + (workout.durationSeconds || 0),
		0,
	);
	const averageDuration =
		totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

	// Calculate days since joining (using createdAt from Clerk)
	const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
	const daysSinceJoining = Math.floor(
		(new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24),
	);

	const formatJoinDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "long",
			year: "numeric",
		});
	};

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#3B82F6" />
					<Text className="text-gray-500 mt-4">Loading Profile</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1" edges={['top']}>
			<ScrollView className="flex-1 ">
				{/* Header */}
				<View className="px-6 pt-8 pb-6">
					<Text className="text-3xl font-bold text-gray-900">
						Profile
					</Text>
					<Text className="text-lg text-gray-500 mt-1">
						Manage your account and stats
					</Text>
				</View>

				{/* User Info Card */}
				<View className="px-6 mb-6">
					<View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<View className="flex-row items-center mb-4">
							<View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-4">
								<Image
									source={{
										uri:
											user?.externalAccounts[0]
												?.imageUrl ?? user?.imageUrl,
									}}
									className="rounded-full"
									style={{ width: 64, height: 64 }}
								/>
							</View>
							<View className="flex-1">
								<Text className="text-xl font-semibold text-gray-900">
									{user?.firstName && user?.lastName
										? `${user.firstName} ${user.lastName}`
										: user?.firstName || "User"}
								</Text>
								<Text className="text-gray-500 text-sm">
									{user?.emailAddresses?.[0]?.emailAddress}
								</Text>
								<Text className="text-sm text-gray-500 mt-1">
									Member since {formatJoinDate(joinDate)}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Stats Overview */}
				<View className="px-6 mb-6">
					<View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<Text className="text-lg  font-semibold text-gray-900 mb-4">
							Your Fitness Stats
						</Text>

						<View className="flex-row justify-between">
							<View className="items-center flex-1">
								<Text className="text-2xl font-bold text-blue-600">
									{totalWorkouts}
								</Text>
								<Text className="text-sm text-gray-500 text-center">
									Total {"\n"} Workouts
								</Text>
							</View>
							<View className="items-center flex-1">
								<Text className="text-2xl font-bold text-green-600">
									{formatDuration(totalDuration)}
								</Text>
								<Text className="text-sm text-gray-500 text-center">
									Total {"\n"} Duration
								</Text>
							</View>
							<View className="items-center flex-1">
								<Text className="text-2xl font-bold text-purple-600">
									{daysSinceJoining}
								</Text>
								<Text className="text-center text-sm text-gray-500">
									Days {"\n"} Since Joining
								</Text>
							</View>
						</View>
						{totalWorkouts > 0 && (
							<View className="mt-4 pt-4 border-t border-gray-100">
								<View className="flex-row items-center justify-between">
									<Text className="text-gray-500 text-sm">
										Average workout duration:
									</Text>
									<Text className="font-semibold text-gray-900 text-sm">
										{formatDuration(averageDuration)}
									</Text>
								</View>
							</View>
						)}
					</View>
				</View>

				{/* Account Settings */}
				<View className="px-6 mb-6">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Account Settings
					</Text>

					{/* Settings Options */}
					<View className="bg-white rounded-2xl shadow-sm border border-gray-100">
						<TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
							<View className="flex-row items-center">
								<View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
									<Ionicons
										name="person-outline"
										size={20}
										color="#3B82F6"
									/>
								</View>
								<Text className="text-gray-900 font-medium">Edit Profile</Text>
							</View>
							<Ionicons name = "chevron-forward" size = {20} color = "#6B7280"/>
						</TouchableOpacity>

						<TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
							<View className="flex-row items-center">
								<View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
									<Ionicons
										name="notifications-outline"
										size={20}
										color="#10B981"
									/>
								</View>
								<Text className="text-gray-900 font-medium">Notifications</Text>
							</View>
							<Ionicons name = "chevron-forward" size = {20} color = "#6B7280"/>
						</TouchableOpacity>
						<TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
							<View className="flex-row items-center">
								<View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
									<Ionicons
										name="settings-outline"
										size={20}
										color="#8B5CF6"
									/>
								</View>
								<Text className="text-gray-900 font-medium">Preferences</Text>
							</View>
							<Ionicons name = "chevron-forward" size = {20} color = "#6B7280"/>
						</TouchableOpacity>
						<TouchableOpacity className="flex-row items-center justify-between p-4">
							<View className="flex-row items-center">
								<View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
									<Ionicons
										name="help-circle-outline"
										size={20}
										color="#F59E0B"
									/>
								</View>
								<Text className="text-gray-900 font-medium">Edit Profile</Text>
							</View>
							<Ionicons name = "chevron-forward" size = {20} color = "#6B7280"/>
						</TouchableOpacity>

					</View>
				</View>

				{/* Sign Out */}
				<View className="px-6 mb-8">
					<TouchableOpacity
						activeOpacity={0.8}
						className="bg-red-600 rounded-2xl p-4 "
						style={{ elevation: 8 }}
						onPress={() => setShowLogoutModal(true)}
					>
						<View className="flex-row items-center justify-center gap-3">
							<Ionicons
								name="log-out-outline"
								size={22}
								color={"white"}
							/>
							<Text className="font-medium text-lg text-white">
								Sign Out
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
			<AlertModal
				title="Sign Out"
				description="Are you sure you want to sign out?"
				actionText="Sign Out"
				showModal={showLogoutModal}
				setShowModal={setShowLogoutModal}
				onPress={signOut}
			/>
		</SafeAreaView>
	);
}
