import { useSignUp } from "@clerk/expo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function EmailVerify() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { signUp, errors, fetchStatus } = useSignUp();
	const [code, setCode] = useState("");

	const handleVerify = async () => {
		setIsLoading(true);
		try {
			await signUp.verifications.verifyEmailCode({
				code,
			});
			if (signUp.status === "complete") {
				await signUp.finalize({
					// Redirect the user to the home page after signing up
					navigate: () => {
						router.replace("/(app)/(tabs)");
					},
				});
			} else {
				// Check why the sign-up is not complete
				console.error("Sign-up attempt not complete:", signUp);
			}
		} catch (error) {
			console.log("VERIFY_ERROR", JSON.stringify(error, null, 2));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAwareScrollView
			enableOnAndroid={true}
			contentContainerStyle={{ flex: 1 }}
		>
			<View className="flex-1 p-6  ">
				<View className="bg-white rounded-full items-center justify-center w-12 h-12">
					<TouchableOpacity
						onPress={async () => {
							router.replace("/(app)/sign-up");
						}}
						style={{ elevation: 6 }}
					>
						<Feather name="chevron-left" size={25} />
					</TouchableOpacity>
				</View>
				<View className="flex-1 justify-center">
					{/* Logo */}
					<View className="items-center mb-8">
						<View
							className="mb-4 rounded-xl "
							style={{ elevation: 8 }}
						>
							<Ionicons name="mail" size={40} color={"white"} />
						</View>
						<Text className="text-2xl font-bold mb-2 text-gray-900">
							Check Your Email
						</Text>
						<Text className="text-center text-gray-500 text-md leading-6">
							We've sent a verification code to {"\n"}
							{signUp.emailAddress}
						</Text>
					</View>
					<View className="bg-white rounded-2xl p-6 shadow  border border-gray-100 mb-6">
						<Text className="text-center text-xl font-bold text-gray-800 mb-6">
							Enter Verification Code
						</Text>
						<View className="mb-6">
							<Text className="text-sm text-gray-600 font-medium mb-2">
								Verification code
							</Text>
							<View className="flex-row items-center rounded-2xl border border-gray-200 px-4 bg-gray-50">
								<Ionicons
									name="key-outline"
									size={20}
									color={"#6B7280"}
								/>
								<TextInput
									value={code}
									placeholder="Enter 6-digit code"
									placeholderTextColor="#9CA3AF"
									onChangeText={(code) => setCode(code)}
									keyboardType="number-pad"
									className="flex-1 ml-2 text-gray-900 text-center tracking-widest"
									maxLength={6}
									editable={!isLoading}
								/>
								{errors.fields.password && (
									<Text className="text-xs  text-red-500 ">
										{errors.fields.password.message}
									</Text>
								)}
							</View>
						</View>
						<TouchableOpacity
							className="bg-green-500 flex-row items-center  py-3 rounded-2xl justify-center gap-2 mb-4"
							onPress={handleVerify}
							disabled={isLoading || fetchStatus === "fetching"}
						>
							{isLoading ? (
								<ActivityIndicator className="text-white" />
							) : (
								<Feather
									name="check-circle"
									size={20}
									color={"white"}
								/>
							)}

							<Text className="text-white font-medium">
								{isLoading ? "Verifying..." : "Verify Email"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => signUp.verifications.sendEmailCode()}
						>
							<Text className="text-blue-600 font-medium text-center text-sm">
								Didn't recieve the code? Resend
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				{/* Footer */}
				<View className="pb-6">
					<Text className="text-sm text-center text-gray-500">
						Almost there! just one more step
					</Text>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
}
