import { useAuth, useSignUp } from "@clerk/expo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
	const { signUp, errors, fetchStatus } = useSignUp();
	const { isSignedIn } = useAuth();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const { error } = await signUp.password({
				emailAddress,
				password,
			});
			if (error) {
				console.error("SIGNUP_ERROR: ", JSON.stringify(error, null, 2));
				return;
			}

			if (!error) {
				await signUp.verifications.sendEmailCode();
				router.replace("/(app)/email-verification");
			}
		} catch (error) {
			console.log(JSON.stringify(error, null, 2));
		} finally {
			setIsLoading(false);
		}
	};

	if (signUp.status === "complete" || isSignedIn) {
		return null;
	}

	

	return (
		<KeyboardAwareScrollView
			enableOnAndroid={true}
			contentContainerStyle={{ flex: 1 }}
		>
			<View className="flex-1 px-6 justify-center">
				<View className="flex items-center mb-10">
					{/* Logo/Branding */}
					<View className="items-center  ">
						<LinearGradient
							colors={["#155dfc", "#9810fa"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								width: 80, // w-20
								height: 80, // h-20
								borderRadius: 16, // rounded-2xl
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 16, // mb-4
								// Shadow
								...Platform.select({
									ios: {
										shadowColor: "#000",
										shadowOffset: { width: 0, height: 4 },
										shadowOpacity: 0.3,
										shadowRadius: 6,
									},
									android: {
										elevation: 8,
									},
								}),
							}}
						>
							<Ionicons name="fitness" size={40} color="white" />
						</LinearGradient>

						<Text
							className="text-3xl font-bold text-gray-900 mb-2"
							numberOfLines={1}
						>
							Join FitTracker
						</Text>
						<Text className="text-md text-gray-400 text-center ">
							Start your fitness journey{"\n"}and achieve your
							goals
						</Text>
					</View>
				</View>

				{/* Signup form */}
				<View className=" p-6 bg-white rounded-2xl border border-gray-100 mb-6">
					<Text className="text-center text-2xl font-bold mb-6">
						Create your Account
					</Text>
					{/* Email input */}
					<View className="mb-4">
						<Text className="text-sm font-medium text-gray-700 mb-2">
							Email
						</Text>
						<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-1 border border-gray-200">
							<Feather name="mail" size={20} color={"#6B7280"} />
							<TextInput
								className="flex-1 ml-3 text-gray-900"
								autoCapitalize="none"
								value={emailAddress}
								placeholder="Enter email"
								placeholderTextColor="#9CA3AF"
								onChangeText={setEmailAddress}
								keyboardType="email-address"
								editable={!isLoading}
							/>
						</View>
						{errors.fields.emailAddress && (
							<Text className="text-xs  text-red-500 ">
								{errors.fields.emailAddress.message}
							</Text>
						)}
					</View>

					<View className="mb-6">
						<Text className="text-sm font-medium text-gray-700 mb-2">
							Password
						</Text>
						<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-1 border border-gray-200">
							<Feather name="lock" size={20} color={"#6B7280"} />
							<TextInput
								className="flex-1 ml-3 text-gray-900"
								autoCapitalize="none"
								value={password}
								placeholder="Enter password"
								placeholderTextColor="#9CA3AF"
								onChangeText={setPassword}
								secureTextEntry={true}
								editable={!isLoading}
							/>
						</View>
						{errors.fields.password && (
							<Text className="text-xs  text-red-500 mt-1">
								{errors.fields.password.message}
							</Text>
						)}
					</View>

					{/* SignUP button */}
					<TouchableOpacity
						className={`rounded-xl py-4 shadow-sm mb-3 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
						disabled={
							!emailAddress ||
							!password ||
							fetchStatus === "fetching"
						}
						activeOpacity={0.8}
						onPress={handleSubmit}
					>
						<View className="flex-row items-center justify-center">
							{isLoading ? (
								<ActivityIndicator className="text-white" />
							) : (
								<Ionicons
									name="person-add-outline"
									size={22}
									color={"white"}
								/>
							)}
							<Text className="text-white font-semibold text-lg ml-2">
								{isLoading
									? "Creating Account..."
									: "Create Account"}
							</Text>
						</View>
					</TouchableOpacity>
				</View>

				{/* Footer section */}
				<View className="flex-row items-center justify-center pb-6">
					<Text className="text-gray-400">
						Already have an account?
					</Text>
					<Link
						href="/sign-in"
						className="font-semibold text-blue-600 ml-1"
					>
						<Text>Sign In</Text>
					</Link>
				</View>

				<View className="items-center">
					<Text className="text-sm text-gray-400">
						Ready to transform your fitness
					</Text>
				</View>

				{/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
				<View nativeID="clerk-captcha" />
			</View>
		</KeyboardAwareScrollView>
	);
}
