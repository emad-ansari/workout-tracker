import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/sanity.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Linking,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import {
	getDifficultyColor,
	getDifficultyText,
	getDifficultyTextColor,
} from "@/components/exercise-card";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const singleExerciseQuery = defineQuery(
	/* groq */ `*[_type == "exercise" && _id == $id][0]`,
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
			const response = await fetch(`${API_BASE_URL}/ai-guidance`, {
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
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			{/* Header with close button */}
			<View className="absolute top-12 right-6 z-10">
				<TouchableOpacity
					className="w-8 h-8 bg-black/30 rounded-full items-center justify-center backdrop-blur-sm"
					onPress={() => router.back()}
				>
					<Ionicons name="close" size={20} color="white" />
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
					<View className="flex-row items-start justify-between mb-6">
						<View className="flex-1 mr-4">
							<Text className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
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
					<View className="mb-8">
						<Text className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
							Description
						</Text>
						<Text className="text-slate-600 text-lg leading-relaxed">
							{exercise?.description ||
								"No description available for this exercise."}
						</Text>
					</View>

					{/* Video section */}
					{exercise?.videoUrl && (
						<View className="mb-8">
							<Text className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
								Video Tutorial
							</Text>
							<TouchableOpacity
								className="bg-rose-500 rounded-2xl p-5 flex-row items-center shadow-sm"
								style={{ elevation: 2 }}
								onPress={() =>
									Linking.openURL(exercise?.videoUrl!)
								}
							>
								<View className="w-14 h-14 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
									<Ionicons
										name="play"
										size={24}
										color="#f43f5e"
									/>
								</View>
								<View>
									<Text className="text-white font-bold text-xl tracking-wide">
										Watch Tutorial
									</Text>
									<Text className="text-rose-100 text-base mt-1 font-medium">
										Learn proper form & technique
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* AI Guidance section */}
				{(aiGuidance || aiLoading) && (
					<View className="mb-8 px-6">
						<View className="flex-row items-center mb-4">
							<View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-3">
								<Ionicons
									name="sparkles"
									size={20}
									color="#4f46e5"
								/>
							</View>
							<Text className="text-2xl font-bold text-slate-900 tracking-tight">
								AI Coach Says
							</Text>
						</View>

						{aiLoading ? (
							<View className="bg-slate-50 rounded-2xl p-6 items-center border border-slate-100">
								<ActivityIndicator
									size={"large"}
									color="#4f46e5"
								/>
								<Text className="text-slate-500 mt-3 font-medium text-base">
									Analyzing biomechanics...
								</Text>
							</View>
						) : (
							<View className="bg-indigo-50/80 rounded-2xl p-6 border border-indigo-100">
								<Markdown
									style={{
										body: {
											paddingBottom: 10,
											fontSize: 16,
											lineHeight: 24,
											color: "#334155",
										},
										heading2: {
											fontSize: 20,
											fontWeight: "800",
											color: "#0f172a",
											marginTop: 16,
											marginBottom: 8,
										},
										heading3: {
											fontSize: 18,
											fontWeight: "700",
											color: "#1e293b",
											marginTop: 12,
											marginBottom: 6,
										},
									}}
								>
									{aiGuidance}
								</Markdown>
							</View>
						)}
					</View>
				)}

				{/* Action button */}
				<View className="mt-4 gap-3 px-6 pb-12">
					{/* AI coach button */}
					<TouchableOpacity
						disabled={aiLoading}
						className={`rounded-2xl py-4 items-center shadow-sm ${aiLoading ? "bg-slate-400" : aiGuidance ? "bg-emerald-500" : "bg-indigo-600"}`}
						style={{ elevation: 2 }}
						onPress={getAiGuidance}
					>
						{aiLoading ? (
							<View className="flex-row items-center">
								<ActivityIndicator
									size="small"
									color="white"
								/>
								<Text className="text-white font-bold text-lg ml-3 tracking-wide">
									Loading...
								</Text>
							</View>
						) : (
							<Text className="text-white font-bold text-lg tracking-wide">
								{aiGuidance
									? "Refresh AI Guidance"
									: "Get AI Guidance on Form & Technique"}
							</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						className="bg-slate-100 rounded-2xl py-4 items-center"
						onPress={() => router.back()}
					>
						<Text className="text-slate-700 font-bold text-lg tracking-wide">
							Close Details
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
