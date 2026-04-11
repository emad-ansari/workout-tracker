import useWorkout from "@/hooks/use-workout";
import { GetWorkoutsQueryResult } from "@/lib/sanity/sanity.types";
import { formatDate, formatWorkoutDuration } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryPage() {
	const { user } = useUser();
	const router = useRouter();
	const { loading, refreshing, workouts, setRefreshing, fetchWorkouts } =
		useWorkout();
	const { refresh } = useLocalSearchParams();

	useEffect(() => {
		if (refresh) {
			fetchWorkouts();
			router.replace("/(app)/(tabs)/history");
		}
	}, [refresh]);

	useEffect(() => {
		fetchWorkouts();
	}, [user?.id]);

	const onRefresh = () => {
		setRefreshing(true);
		fetchWorkouts();
	};

	const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
		return (
			workout.exercises?.reduce((total, exercise) => {
				return total + (exercise.sets?.length || 0);
			}, 0) || 0
		);
	};

	const getExerciseNames = (workout: GetWorkoutsQueryResult[number]) => {
		return (
			workout.exercises?.map((ex) => ex.exercise?.name).filter(Boolean) ||
			[]
		);
	};

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-white">
				<View className="flex-1 bg-gray-50">
					<View className="px-6 py-4 bg-white border-b border-gray-200">
						<Text className="text-2xl font-bold tex-gray-900">
							Workout History
						</Text>
					</View>
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size={"large"} color="#3B82F6" />
						<Text className="text-gray-600 mt-4 ">
							Loading your workouts...
						</Text>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<StatusBar barStyle={"dark-content"} />
			<View className="flex-1 bg-gray-50">
				{/* Header */}
				<View className="px-6 py-4 bg-white border-b border-gray-200">
					<Text className="text-2xl font-bold text-gray-900">
						Workout History
					</Text>
					<Text className="text-gray-500 mt-1">
						{workouts.length} workout{" "}
						{workouts.length > 1 ? "s" : ""}
						completed
					</Text>
				</View>

				{/* Workout list */}
				<ScrollView
					className="flex-1 "
					contentContainerStyle={{ padding: 24 }}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
				>
					{workouts.length == 0 ? (
						<View className="bg-white rounded-2xl p-8 items-center">
							<Ionicons
								name="barbell-outline"
								size={64}
								color="#9CA3AF"
							/>
							<Text className="text-xl font-semibold text-gray-900 mt-4">
								No workouts yet
							</Text>
							<Text className="text-gray-500 text-center mt-2">
								Your completed workouts will appear here
							</Text>
						</View>
					) : (
						<View className="space-y-4 gap-4 ">
							{workouts.map((workout) => (
								<TouchableOpacity
									key={workout._id}
									className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
									onPress={() =>
										router.push({
											pathname: "/history/workout-record",
											params: {
												workoutId: workout._id,
											},
										})
									}
								>
									{/* Workout header */}
									<View className="flex-row items-center justify-between mb-4">
										<View className="flex-1">
											<Text className="text-lg font-semibold text-gray-900">
												{formatDate(workout.date || "")}
											</Text>
											<View className="flex-row items-center mt-1">
												<Ionicons
													name="time-outline"
													size={18}
													color="#6B7280"
												/>
												<Text className="text-gray-500 ml-2">
													{formatWorkoutDuration(
														workout.durationSeconds,
													)}
												</Text>
											</View>
										</View>
										<View className="bg-blue-100 rounded-full w-14 h-14 items-center justify-center">
											<Ionicons
												name="fitness-outline"
												size={24}
												color="#3B82F6"
											/>
										</View>
									</View>

									{/* Workout stats */}
									<View className="flex-row items-center justify-between mb-4">
										<View className="flex-row items-center">
											<View className="bg-gray-100 rounded-full px-3 py-2 mr-3">
												<Text className="text-sm font-medium text-gray-700">
													{workout.exercises
														?.length || 0}{" "}
													exercises
												</Text>
											</View>
											<View className="bg-gray-100 rounded-full px-3 py-2">
												<Text className="text-sm font-medium text-gray-700">
													{getTotalSets(workout)} sets
												</Text>
											</View>
										</View>
									</View>

									{/* Excercise List */}
									{workout.exercises &&
										workout.exercises.length > 0 && (
											<View>
												<Text className="text-sm font-medium text-gray-700 mb-2">
													Excercises:
												</Text>
												<View className="flex-row flex-wrap">
													{getExerciseNames(workout)
														.slice(0, 3)
														.map((name, index) => (
															<View
																key={index}
																className="bg-blue-50 rounded-2xl px-3 py-1  mr-2 mb-2"
															>
																<Text className="text-blue-700 text-sm font-medium">
																	{name}
																</Text>
															</View>
														))}
													{getExerciseNames(workout)
														.length > 3 && (
														<View className="bg-gray-100 rounded-2xl px-2 py-1 mr-2 mb-2">
															<Text className="text-gray-500 text-sm font-medium">
																+
																{getExerciseNames(
																	workout,
																).length -
																	3}{" "}
																more
															</Text>
														</View>
													)}
												</View>
											</View>
										)}
								</TouchableOpacity>
							))}
						</View>
					)}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
