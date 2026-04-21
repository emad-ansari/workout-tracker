import useWorkout from "@/hooks/use-workout";
import { GetWorkoutsQueryResult } from "@/lib/sanity/sanity.types";
import { formatDate, formatDuration } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
	const { user } = useUser();
	const router = useRouter();
	const { loading, workouts, refreshing, setRefreshing, fetchWorkouts } =
		useWorkout();

	useEffect(() => {
		fetchWorkouts();
	}, [user?.id]);

	const onRefresh = () => {
		setRefreshing(true);
		fetchWorkouts();
	};

	// Calculate Stats
	const totalWorkouts = workouts.length;
	const lastWorkout = workouts[0];
	const totalDuration = workouts.reduce(
		(sum, workout) => sum + (workout.durationSeconds || 0),
		0,
	);
	const averageDuration =
		totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
	const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
		return (
			workout.exercises?.reduce((total, exercise) => {
				return total + (exercise.sets?.length || 0);
			}, 0) || 0
		);
	};

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#3B82F6" />
					<Text>Loading your stats...</Text>
				</View>
			</SafeAreaView>
		);
	}
	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
			<ScrollView
				className="flex-1"
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				{/* Header */}
				<View className="px-6 pt-8 pb-6">
					<Text className="text-lg text-gray-600 font-sans">
						Welcome back,
					</Text>
					<Text className="text-3xl font-bold text-gray-900 ">
						{user?.firstName || "Athelete"}! 💪
					</Text>
				</View>
				{/* Stats Overview */}
				<View className="px-6 mb-6 rounded">
					<View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
						<Text className="text-lg  font-semibold text-gray-900 mb-4 font-bold upper">
							Your Stats
						</Text>

						<View className="flex-row justify-between gap-2">
							<View className="items-center flex-1 bg-blue-500/20 rounded-3xl p-4 gap-2">
								<Text className="text-xs  text-center  font-sans uppercase text-blue-600 tracking-[1px]">
									Workouts
								</Text>
								<Text className="text-2xl font-bold text-black font-sans">
									{totalWorkouts}
								</Text>
							</View>

							<View className="items-center flex-1 bg-green-500/20 rounded-3xl p-4 gap-2">
								<Text className="text-xs  text-center uppercase tracking-[1px] text-green-600">
									Duration
								</Text>
								<Text className="text-2xl font-bold text-black">
									{formatDuration(totalDuration)}
								</Text>
							</View>
							<View className="items-center flex-1 rounded-3xl p-4 bg-purple-500/20 gap-2">
								<Text className="text-center text-xs text-purple-600 uppercase tracking-[1px]">
									Average Duration
								</Text>
								<Text className="text-2xl font-bold text-black">
									{averageDuration > 0
										? formatDuration(averageDuration)
										: "0m"}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Quick Action */}
				<View className="px-6 mb-6">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Quick Actions
					</Text>

					{/* Start Workout Button */}
					<TouchableOpacity
						className="bg-blue-600 rounded-2xl p-6 mb-4 shadow-sm"
						activeOpacity={0.8}
						onPress={() => router.push("/workout")}
					>
						<View className="flex-row items-center justify-between">
							<View className="flex-row items-center flex-1">
								<View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
									<Ionicons
										name="play"
										size={24}
										color={"white"}
									/>
								</View>
								<View>
									<Text className="text-white texxt-xl font-semibold">
										Start Workout
									</Text>
									<Text className="text-blue-100">
										Begin your training session
									</Text>
								</View>
							</View>
							<Ionicons
								name="chevron-forward"
								size={24}
								color="white"
							/>
						</View>
					</TouchableOpacity>

					{/* Action Grid */}
					<View className="flex-row gap-4">
						<TouchableOpacity
							className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100"
							activeOpacity={0.7}
							onPress={() => router.push("/history")}
						>
							<View className="items-center">
								<View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-3">
									<Ionicons
										name="time-outline"
										size={24}
										color="#6B7280"
									/>
								</View>
								<Text className="text-gray-800 font-medium text-center">
									Workout {"\n"} History
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100"
							activeOpacity={0.7}
							onPress={() => router.push("/exercises")}
						>
							<View className="items-center">
								<View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-3">
									<Ionicons
										name="time-outline"
										size={24}
										color="#6B7280"
									/>
								</View>
								<Text className="text-gray-800 font-medium text-center">
									Browse {"\n"} Exercises
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				{/* Last Workout  */}
				{lastWorkout && (
					<View className="px-6 mb-8">
						<Text className="text-lg font-semibold text-gray-800 mb-4">
							Last Workout
						</Text>
						<TouchableOpacity
							className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
							onPress={() =>
								router.push({
									pathname: "/history/workout-record",
									params: { workoutId: lastWorkout._id },
								})
							}
							activeOpacity={0.7}
						>
							<View className="flex-row items-center justify-between mb-4">
								<View>
									<Text className="text-lg font-semibold text-gray-800">
										{formatDate(lastWorkout.date || "")}
									</Text>
									<View className="flex-row items-center mt-1">
										<Ionicons
											name="time-outline"
											size={16}
											color="#6B7280"
										/>
										<Text className="text-gray-500 ml-2 text-sm">
											{lastWorkout.durationSeconds
												? formatDuration(
														lastWorkout.durationSeconds,
													)
												: "Duration not recorded"}
										</Text>
									</View>
								</View>
								<View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
									<Ionicons
										name="fitness-outline"
										size={24}
										color="#3B82F6"
									/>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				)}

				{/* Empty Workout */}
				{totalWorkouts === 0 && (
					<View className="px-6 mb-8">
						<View className="bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-100">
							<View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
								<Ionicons
									name="barbell-outline"
									size={32}
									color="#3B82F6"
								/>
							</View>
							<Text className="text-xl font-semibold text-gray-900 mb-2">
								Ready to start your fitness journey
							</Text>
							<Text className="text-gray-500 text-center mb-4 text-sm">
								Track your workouts and see your progres over
								time
							</Text>

							<TouchableOpacity
								className="bg-blue-600 rounded-xl px-6 py-3"
								activeOpacity={0.8}
								onPress={() => router.push("/workout")}
							>
								<Text className="text-white font-semibold">
									Start Your First Workout
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
