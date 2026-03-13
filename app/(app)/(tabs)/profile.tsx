import { useAuth } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {  Modal, Text, TouchableOpacity, View } from "react-native";

export default function ProfilePage() {
	const { signOut } = useAuth();
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	

	return (
		<View className="flex-1 p-6">
			<Text>Profile Screen</Text>
			<View>
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
			<Modal visible={showLogoutModal} transparent animationType="fade">
				<View className="flex-1 justify-center items-center bg-black/40">
					<View className="w-[85%] bg-white rounded-2xl p-6">
						<Text className="text-xl font-semibold text-center">
							Sign Out
						</Text>

						<Text className="text-gray-500 text-center mt-2">
							Are you sure you want to sign out?
						</Text>

						<View className="flex-row justify-between mt-6">
							<TouchableOpacity
								className="flex-1 mr-2 py-3 rounded-xl bg-gray-200"
								onPress={() => setShowLogoutModal(false)}
							>
								<Text className="text-center font-medium">
									Cancel
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-1 ml-2 py-3 rounded-xl bg-red-500"
								onPress={() => {
									setShowLogoutModal(false);
									signOut();
								}}
							>
								<Text className="text-center text-white font-medium">
									Sign Out
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
      
		</View>
	);
}
