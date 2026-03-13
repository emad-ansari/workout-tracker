import { urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/sanity.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ExerciseCardProps {
	item: Exercise;
	onPress: () => void;
	showChevron?: boolean;
}

export const getDifficultyColor = (difficulty: string) => {
	switch (difficulty) {
		case "beginner":
			return "bg-green-500/20 ";
		case "intermediate":
			return "bg-yellow-500/20";
		case "advanced":
			return "bg-red-500/20";
		default:
			return "bg-gray-500/20";
	}
};

export const getDifficultyText = (difficulty: string) => {
	switch (difficulty) {
		case "beginner":
			return "Beginner";
		case "intermediate":
			return "Intermediate";
		case "advanced":
			return "Advanced";
		default:
			return "Unknown";
	}
};
export const getDifficultyTextColor = (difficulty: string) => {
	switch (difficulty) {
		case "beginner":
			return "text-green-500";
		case "intermediate":
			return "text-yellow-500";
		case "advanced":
			return "text-red-500";
		default:
			return "text-gray-500";
	}
};

export default function ExerciseCard({
	item,
	onPress,
	showChevron,
}: ExerciseCardProps) {
	return (
		<View className="p-px bg-gray-100 rounded-3xl mb-4">
			<TouchableOpacity
				onPress={onPress}
				className="bg-white rounded-3xl border border-gray-100 "
				activeOpacity={0.8}
			>
				<View className="flex-row p-6">
					<View className="w-20 h-20 bg-rounded-xl mr-4 overflow-hidden">
						{item.image ? (
							<Image
								source={{
									uri: urlFor(item.image).url(),
								}}
								className="w-full h-full"
								resizeMode="contain"
							/>
						) : (
							<View className="w-full h-full items-center justify-center">
								<Ionicons
									name="fitness"
									size={24}
									color="white"
								/>
							</View>
						)}
					</View>
					<View className="flex-1 justify-bewteen">
						<View>
							<Text className="text-lg font-bold text-gray-900 mb-1">
								{item.name}
							</Text>
							<Text
								className="text-sm  text-gray-400 mb-2"
								numberOfLines={2}
							>
								{item.description || "No description available"}
							</Text>
						</View>
						<View className="flex-row items-center justify-between">
							<View
								className={`px-3 py-1 rounded-full ${getDifficultyColor(item.difficulty!)}`}
							>
								<Text
									className={`text-xs  font-semibold ${getDifficultyTextColor(item.difficulty!)}`}
								>
									{getDifficultyText(
										item.difficulty as string,
									)}
								</Text>
							</View>
							{showChevron && (
								<TouchableOpacity className="p-2">
									<Ionicons
										name="chevron-forward"
										size={20}
										color="#6B7280"
									/>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
}
