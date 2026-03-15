import { client } from "@/lib/sanity/client";
import { GetWorkoutRecordQueryResult } from "@/lib/sanity/sanity.types";
import { formatWorkoutDuration } from "@/lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export const getWorkoutRecordQuery =
	defineQuery(/* groq */ `*[_type == "workout" && _id == $workoutId][0] {
    _id,
    _type,
    _createdAt,
    date,
    durationSeconds,
    exercises[] {
      exercise-> {
        _id,
        name,
        description
      },
      sets[] {
        reps,
        weight,
        weightUnit,
        _type,
        _key
      },
      _type,
      _key
    }
}`);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function WorkoutRecord() {
	const router = useRouter();
	const { workoutId } = useLocalSearchParams();
	const [loading, setLoading] = useState<boolean>(true);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [workout, setWorkout] = useState<GetWorkoutRecordQueryResult | null>(
		null,
	);

	useEffect(() => {
		const fetchWorkout = async () => {
			try {
				const result = await client.fetch(getWorkoutRecordQuery, {
					workoutId,
				});

				setWorkout(result);
			} catch (error) {
				console.error("FETCH_WORKOUT_RECORD_ERROR: ", error);
			} finally {
				setLoading(false);
			}
		};
		fetchWorkout();
	}, [workoutId]);

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Unknown Date";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (dateString: string | null) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const getTotalSets = () => {
		return (
			workout?.exercises?.reduce((total, exercise) => {
				return total + (exercise.sets?.length || 0);
			}, 0) || 0
		);
	};

	const getTotalVolume = () => {
		let totalVolume = 0;
		let unit = "lbs";

		workout?.exercises?.forEach((exericse) => {
			exericse?.sets?.forEach((set) => {
				if (set.weight && set.reps) {
					totalVolume += set.weight * set.reps;
					unit = set.weightUnit || "lbs";
				}
			});
		});
		return { volume: totalVolume, unit };
	};

	const deleteWorkout = async () => {
		if (!workoutId) return;
		setDeleting(true);
		try {
			const response = await fetch(`${API_BASE_URL}/delete-workout`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ workoutId }),
			});
			const data = await response.json();

			console.log("delete response: ", data);

			router.replace("/(app)/(tabs)/history?refresh=true");
		} catch (error) {
			console.error("DELETE_WORKOUT_ERROR: ", error);
		} finally {
			setDeleting(false);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 bg-gray-50 items-center justify-center">
				<ActivityIndicator size="large" color={"#3b82f6"} />
				<Text className="text-gray-500 mt-4">Loading workout...</Text>
			</View>
		);
	}

	if (!workout) {
		return (
			<View className="flex-1 bg-gray-50 items-center justify-center">
				<Ionicons name="alert-circle-outline" size={64} />
				<Text className="text-xl text-gray-900 mt-4">
					Workout Not Found
				</Text>
				<Text className="text-xl text-gray-900 mt-4">
					This workout record could not be found
				</Text>
				<TouchableOpacity
					className="flex-row items-center bg-blue-500 px-6 py-3  rounded-xl mt-6 gap-2"
					onPress={() => router.back()}
				>
					<Ionicons name="chevron-back" size={24} color="white" />
					<Text className="text-white ">Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const { volume, unit } = getTotalVolume();

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<View className="flex-row items-center px-4 py-3 bg-white gap-16 border-b border-gray-100">
				<TouchableOpacity
					onPress={() => router.back()}
					className="flex-row gap-0.5 items-center"
				>
					<Ionicons name="chevron-back" size={24} color="#2b7fff" />
					<Text className="text-md text-blue-500 font-medium">
						History
					</Text>
				</TouchableOpacity>
				<View>
					<Text className="text-md font-medium text-gray-900 ">
						Workout Record
					</Text>
				</View>
			</View>

			<ScrollView className="flex-1">
				{/* Workout summary */}
				<View className="bg-white p-6 border-b border-gray-200">
					<View className="flex-row items-center justify-between mb-4">
						<Text className="text-lg font-semibold text-gray-900">
							Workout Summary
						</Text>
						<TouchableOpacity
							disabled={deleting}
							className="bg-red-600 px-4 py-2 rounded-xl flex-row items-center"
							onPress={() => setShowDeleteModal(true)}
						>
							{deleting ? (
								<ActivityIndicator
									size="small"
									color="#FFFFFF"
								/>
							) : (
								<>
									<Ionicons
										name="trash-outline"
										size={16}
										color="#FFFFFF"
									/>
									<Text className="text-white font-medium ml-2">
										Delete
									</Text>
								</>
							)}
						</TouchableOpacity>
					</View>

					<View className="flex-row items-center mb-3">
						<Ionicons
							name="calendar-outline"
							size={20}
							color="#6b7280"
						/>
						<Text className="text-gray-500 font-medium ml-3 ">
							{formatDate(workout.date)} at{" "}
							{formatTime(workout.date)}
						</Text>
					</View>

					<View className="flex-row items-center mb-3">
						<Ionicons
							name="time-outline"
							size={20}
							color="#6b7280"
						/>
						<Text className="text-gray-500 font-medium ml-3 ">
							{formatWorkoutDuration(workout.durationSeconds)}
						</Text>
					</View>

					{/* total exercises */}
					<View className="flex-row items-center mb-3">
						<Ionicons
							name="fitness-outline"
							size={20}
							color="#6b7280"
						/>
						<Text className="text-gray-500 font-medium ml-3 ">
							{workout.exercises?.length || 0} exercises
						</Text>
					</View>

					{/* total sets */}
					<View className="flex-row items-center mb-3">
						<Ionicons
							name="bar-chart-outline"
							size={20}
							color="#6b7280"
						/>
						<Text className="text-gray-500 font-medium ml-3 ">
							{getTotalSets()} total sets
						</Text>
					</View>

					{/* Total volumes */}
					{volume > 0 && (
						<View className="flex-row items-center mb-3">
							<Ionicons
								name="barbell-outline"
								size={20}
								color="#6b7280"
							/>
							<Text className="text-gray-500 font-medium ml-3 ">
								{volume.toLocaleString()} {unit} total volume
							</Text>
						</View>
					)}
				</View>

				{/* Exercise List */}
				<View className="space-y-4 p-6 gap-4">
					{workout.exercises?.map((ex, index) => (
						<View
							key={index}
							className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
						>
							{/* Exercise Header */}
							<View className="flex-row items-center justify-between mb-4">
								<View className="flex-1">
									<Text className="text-lg font-bold text-gray-900">
										{ex.exercise?.name ||
											"Unknown Exercise"}
									</Text>
									<Text className="text-gray-500 text-sm mt-1">
										{ex.sets?.length || 0} sets completed
									</Text>
								</View>
								<View className="bg-blue-100 rounded-full w-10 h-10 items-center justify-center">
									<Text className="text-blue-600 font-bold">
										{index + 1}
									</Text>
								</View>
							</View>

							{/* Sets */}
							<View className="space-y-2">
								<Text className="text-sm font-medium text-gray-700 mb-2">
									Sets:
								</Text>
								{ex.sets?.map((set, setIndex) => (
									<View
										key={set._key}
										className="bg-gray-50 rounded-xl p-3 flex-row items-center justify-between mb-2"
									>
										<View className="flex-row items-center">
											<View className="bg-gray-200 rounded-full w-6 h-6 items-center justify-center mr-3">
												<Text className="text-gray-700 text-xs font-medium">
													{setIndex + 1}
												</Text>
											</View>
											<Text className="text-gray-900 font-medium">
												{set.reps} reps
											</Text>
										</View>

										{set.weight != null && (
											<View className="flex-row items-center">
												<Ionicons
													name="barbell-outline"
													size={16}
													color="#6B7280"
												/>
												<Text className="text-gray-700 ml-2 font-medium">
													{set.weight}{" "}
													{set.weightUnit || "lbs"}
												</Text>
											</View>
										)}
									</View>
								))}
							</View>

							{/* Exercise Volume Summary */}
							{ex.sets && ex.sets.length > 0 && (
								<View className="mt-4 pt-4 border-t border-gray-100">
									<View className="flex-row items-center justify-between">
										<Text className="text-sm text-gray-500">
											Exercise Volume:
										</Text>
										<Text className="text-sm text-gray-500">
											{ex.sets
												.reduce((total, set) => {
													return (
														total +
														(set.weight || 0) *
															(set.reps || 0)
													);
												}, 0)
												.toLocaleString()}
											{ex.sets[0]?.weightUnit || "lbs"}
										</Text>
									</View>
								</View>
							)}
						</View>
					))}
				</View>
			</ScrollView>

			<Modal visible={showDeleteModal} transparent animationType="fade">
				<View className="flex-1 bg-black/40 items-center justify-center px-6">
					<View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
						{/* Title */}
						<View className="px-6 pt-6 pb-2">
							<Text className="text-lg font-semibold text-center">
								Delete Workout
							</Text>

							<Text className="text-gray-500 text-center mt-2">
								Are you sure you want to delete this workout?
								This action cannot be undone.
							</Text>
						</View>

						{/* Divider */}
						<View className="h-px bg-gray-200 mt-4" />

						{/* Buttons */}
						<View className="flex-row">
							<TouchableOpacity
								className="flex-1 py-4 items-center"
								onPress={() => setShowDeleteModal(false)}
							>
								<Text className="text-blue-500 font-medium">
									Cancel
								</Text>
							</TouchableOpacity>

							<View className="w-px bg-gray-200" />

							<TouchableOpacity
								className="flex-1 py-4 items-center"
								onPress={() => {
									setShowDeleteModal(false);
									deleteWorkout();
								}}
							>
								<Text className="text-red-500 font-semibold">
									Delete
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
