import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from "expo-linear-gradient";
import { defineQuery } from "groq";
import Ionicons from "@expo/vector-icons/Ionicons";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/sanity.types";
import {
	ActivityIndicator,
	Image,
	Linking,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import {
	getDifficultyColor,
	getDifficultyText,
	getDifficultyTextColor,
} from "@/components/exercise-card";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const singleExerciseQuery = defineQuery(
	`*[_type == "exercise" && _id == $id][0]`,
);

export default function ExerciseDetail() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const [exercise, setExercise] = useState<Exercise | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [aiGuidance, setAiGuidance] = useState<string>("");
	const [aiLoading, setAiLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchExercise = async () => {
			if (!id) return;
			try {
				setLoading(true);
				const exerciseData = await client.fetch(singleExerciseQuery, {
					id,
				});
				setExercise(exerciseData);
			} catch (error) {
				console.error("FETCH_EXERCISE_DETAIL_ERROR: ", error);
			} finally {
				setLoading(false);
			}
		};
		fetchExercise();
	}, []);

	const getAiGuidance = async () => {
		if (!exercise) return;
		try {
			setAiLoading(true);
			const response = await fetch(`${API_BASE_URL}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ exerciseName: exercise.name }),
			});

			if (!response.ok) {
				throw new Error("Faild to fetch AI guidance");
			}
			const data = await response.json();


			setAiGuidance(data.guidance);
		} catch (error) {
			console.error("FETCHING_AI_GUIDANCE_ERROR", error);
			setAiGuidance(
				"Sorry, there was an error getting AI guidance. Please try again.",
			);
		} finally {
			setAiLoading(false);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 items-center pt-20">
				<ActivityIndicator size={"large"} color="#0000ff" />
				<Text className="text-gray-500">Loading exercise...</Text>
			</View>
		);
	}

	return (
		<View
			className="flex-1 bg-white mt-5  border border-gray-100 rounded-tl-3xl rounded-tr-3xl "
			style={{
				elevation: 2,
			}}
		>
			{/* Header with close button */}

			<View className="absolute top-8 left-0 right-0 z-10 px-4 ">
				<TouchableOpacity
					className="w-10 h-10 bg-black/20  rounded-full items-center justify-center backdrop-blur-sm"
					onPress={() => router.back()}
				>
					<Ionicons name="close" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView className="flex-1 ">
				<View className="h-80 bg-white relative">
					{exercise?.image ? (
						<Image
							source={{ uri: urlFor(exercise.image).url() }}
							className="w-full h-full "
							resizeMode="contain"
						/>
					) : (
						<LinearGradient
							colors={["#51a2ff", "#ad46ff"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							className="w-full h-full items-center justify-center"
						>
							<Ionicons
								name="fitness"
								size={80}
								color={"white"}
							/>
						</LinearGradient>
					)}
				</View>

				{/* content */}
				<View className="px-6 py-6">
					{/* title and difficulty */}
					<View className="flex-row items-start justify-between mb-4">
						<View className="flex-1 mr-4 ">
							<Text className="text-3xl font-bold text-gray-800 mb-2">
								{exercise?.name}
							</Text>
							<View
								className={`self-start px-4 py-2 rounded-full ${getDifficultyColor(exercise?.difficulty!)}`}
							>
								<Text
									className={`text-sm font-semibold ${getDifficultyTextColor(exercise?.difficulty!)}`}
								>
									{getDifficultyText(
										(exercise && exercise.difficulty) ||
											"Beginner",
									)}
								</Text>
							</View>
						</View>
					</View>

					{/* description */}
					<View className="mb-6">
						<Text className="text-xl font-semibold text-gray-800 mb-3">
							Description
						</Text>
						<Text className="text-gray-500 text-base">
							{exercise?.description ||
								"No description available for this exercise."}
						</Text>
					</View>

					{/* Video section */}
					{exercise?.videoUrl && (
						<View className="mb-6">
							<Text className="text-xl font-semibold text-gray-800 mb-3">
								Video Tutorial
							</Text>
							<TouchableOpacity
								className="bg-red-500  rounded-xl p-4 flex-row items-center"
								onPress={() =>
									Linking.openURL(exercise?.videoUrl!)
								}
							>
								<View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
									<Ionicons
										name="play"
										size={20}
										color="#EF4444"
									/>
								</View>
								<View>
									<Text className="text-white font-semibold text-lg">
										Watch Tutorial
									</Text>
									<Text className="text-red-100 text-sm">
										Learn proper form
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* AI Guidance section */}
				{(aiGuidance || aiLoading) && (
					<View className="mb-6 p-6">
						<View className="flex-row items-center mb-3">
							<Ionicons
								name="fitness"
								size={24}
								color="#3B82F6"
							/>
							<Text className="text-xl font-semibold text-gray-800 ml-2">
								AI coach says...
							</Text>
						</View>

						{aiLoading ? ( 
						
							<View className="bg-gray-50 rounded-xl p-4 items-center">
								<ActivityIndicator size = {'small'} color = "#3B82F6"/>	
								<Text className= "text-gray-600 mt-2">Getting personalized guidance...</Text>
							</View> ): (
							<View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
								<Markdown 
									style = {{
										body: {
											paddingBottom: 20
										},
										heading2: {
											fontSize: 18,
											fontWeight: "bold",
											color: '#1f2937',
											marginTop: 12,
											marginBottom: 6
										},
										heading3: {
											fontSize: 16,
											fontWeight: "600",
											color: "#374151",
											marginTop: 8,
											marginBottom: 4
										}
									}}
								>
									{aiGuidance}
								</Markdown>
							</View>
						)}
					</View>
				)}

				{/* Action button */}
				<View className="mt-8 gap-2 p-6">
					{/* AI coach button */}
					<TouchableOpacity
						disabled={aiLoading}
						className={`rounded-xl py-4 items-center  ${aiLoading ? "bg-gray-400" : aiGuidance ? "bg-green-500" : "bg-blue-500"}`}
						onPress={getAiGuidance}
					>
						{aiLoading ? (
							<View className="flex-row items-center">
								<ActivityIndicator size="small" color="white" />
								<Text className="text-white font-bold text-lg ml-2 ">
									Loading...
								</Text>
							</View>
						) : (
							<Text className="text-white font-semibold text-lg">
								{aiGuidance
									? "Refresh AI Guidance"
									: "Get AI Guidance on Form & Technique"}
							</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						className="bg-gray-200 rounded-xl py-4 items-center"
						onPress={() => router.back()}
					>
						<Text className="text-gray-800 font-semibold text-lg">
							Close
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}
