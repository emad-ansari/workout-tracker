import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AlertModalProps {
	title: string;
	description: string;
	actionText: string;
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	onPress: () => Promise<void> | void;
}

export const AlertModal = ({
	title,
	description,
	actionText,
	showModal,
	setShowModal,
	onPress,
}: AlertModalProps) => {
	const handleOnpress = () => {
		setShowModal(false);
		onPress();
	};

	return (
		<Modal visible={showModal} transparent animationType="fade">
			<View className="flex-1 bg-black/40 items-center justify-center px-6">
				<View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
					{/* Title */}
					<View className="px-6 pt-6 pb-2">
						<Text className="text-lg font-semibold text-center">
							{title}
						</Text>

						<Text className="text-gray-500 text-center mt-2">
							{description}
						</Text>
					</View>

					{/* Divider */}
					<View className="h-px bg-gray-200 mt-4" />

					{/* Buttons */}
					<View className="flex-row">
						<TouchableOpacity
							className="flex-1 py-4 items-center"
							onPress={() => setShowModal(false)}
						>
							<Text className="text-blue-500 font-medium">
								Cancel
							</Text>
						</TouchableOpacity>

						<View className="w-px bg-gray-200" />

						<TouchableOpacity
							className="flex-1 py-4 items-center"
							onPress={handleOnpress}
						>
							<Text className="text-red-500 font-semibold">
								{actionText}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};
