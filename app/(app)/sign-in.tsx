import GoogleSignIn from "@/components/google-singin";
import { useSignIn } from "@clerk/expo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignInScreen() {
	const { signIn, errors, fetchStatus } = useSignIn();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const { error } = await signIn.password({
				emailAddress,
				password,
			});
			if (error) {
				console.error(JSON.stringify(error, null, 2));
				return;
			}

			if (signIn.status === "complete") {
				await signIn.finalize({
					navigate: async () => {
						router.replace("/(app)/(tabs)/index" as Href);
					},
				});
			} else if (signIn.status === "needs_second_factor") {
				// See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
			} else if (signIn.status === "needs_client_trust") {
				// For other second factor strategies,
				// see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
				const emailCodeFactor = signIn.supportedSecondFactors.find(
					(factor) => factor.strategy === "email_code",
				);

				if (emailCodeFactor) {
					await signIn.mfa.sendEmailCode();
				}
			} else {
				// Check why the sign-in is not complete
				console.error("Sign-in attempt not complete:", signIn);
			}
		} catch (error) {
			console.log(JSON.stringify(error, null, 2));
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerify = async () => {
		await signIn.mfa.verifyEmailCode({ code });

		if (signIn.status === "complete") {
			await signIn.finalize({
				navigate: ({ session, decorateUrl }) => {
					if (session?.currentTask) {
						// Handle pending session tasks
						// See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
						console.log(session?.currentTask);
						return;
					}

					const url = decorateUrl("/");
					if (url.startsWith("http")) {
						window.location.href = url;
					} else {
						router.push(url as Href);
					}
				},
			});
		} else {
			// Check why the sign-in is not complete
			console.error("Sign-in attempt not complete:", signIn);
		}
	};

	if (signIn.status === "needs_client_trust") {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Verify your account</Text>
				<TextInput
					style={styles.input}
					value={code}
					placeholder="Enter your verification code"
					placeholderTextColor="#666666"
					onChangeText={(code) => setCode(code)}
					keyboardType="numeric"
				/>
				{errors.fields.code && (
					<Text style={styles.error}>
						{errors.fields.code.message}
					</Text>
				)}
				<Pressable
					style={({ pressed }) => [
						styles.button,
						fetchStatus === "fetching" && styles.buttonDisabled,
						pressed && styles.buttonPressed,
					]}
					onPress={handleVerify}
					disabled={fetchStatus === "fetching"}
				>
					<Text style={styles.buttonText}>Verify</Text>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						styles.secondaryButton,
						pressed && styles.buttonPressed,
					]}
					onPress={() => signIn.mfa.sendEmailCode()}
				>
					<Text style={styles.secondaryButtonText}>
						I need a new code
					</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			enableOnAndroid={true}
			keyboardShouldPersistTaps="handled"
		>
			<View className="flex-1 justify-center gap-10 px-6">
				{/* Header section */}
				<View className="flex justify-center">
					{/* Logo/Branding */}
					<View className="items-center ">
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

						<Text className="text-3xl font-bold text-gray-900 mb-2">
							FitTracker
						</Text>
						<Text className="text-md text-gray-400 text-center">
							Track your fitness journey {"\n"} and reach your
							goals
						</Text>
					</View>
				</View>

				{/* SignIn Form */}
				<View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 ">
					<Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
						Welcome Back
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
						{errors.fields.identifier && (
							<Text className="text-[#d32f2f] text-xs mt-2">
								{errors.fields.identifier.message}
							</Text>
						)}
					</View>

					{/* Password section */}
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
						{errors.fields.identifier && (
							<Text className="text-[#d32f2f] text-xs mt-2">
								{errors.fields.identifier.message}
							</Text>
						)}
					</View>

					{/* SignIn button */}
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
									name="log-in-outline"
									size={22}
									color={"white"}
								/>
							)}
							<Text className="text-white font-semibold text-lg ml-2">
								{isLoading ? "Signing In..." : "Sign In"}
							</Text>
						</View>
					</TouchableOpacity>

					{/* Divider */}
					<View className="flex-row items-center my-4 gap-2 mb-5">
						<View className="flex-1 h-px bg-gray-200" />
						<Text className="text-gray-500 text-sm">or</Text>
						<View className="flex-1 h-px bg-gray-200" />
					</View>
					<GoogleSignIn />
				</View>

				{/* Footer section */}
				<View className="flex-row items-center justify-center pb-6">
					<Text className="text-gray-400">
						Don't have an account?{" "}
					</Text>
					<Link
						href="/sign-up"
						className="font-semibold text-blue-600"
					>
						<Text>Sign up</Text>
					</Link>
				</View>

				<View className="items-center">
					<Text className="text-sm text-gray-400">
						Start your fitness journey today
					</Text>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 12,
	},
	title: {
		marginBottom: 8,
	},
	label: {
		fontWeight: "600",
		fontSize: 14,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#fff",
	},
	button: {
		backgroundColor: "#0a7ea4",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 8,
	},
	buttonPressed: {
		opacity: 0.7,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
	},
	secondaryButton: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 8,
	},
	secondaryButtonText: {
		color: "#0a7ea4",
		fontWeight: "600",
	},
	linkContainer: {
		flexDirection: "row",
		gap: 4,
		marginTop: 12,
		alignItems: "center",
	},
	error: {
		color: "#d32f2f",
		fontSize: 12,
		marginTop: -8,
	},
	debug: {
		fontSize: 10,
		opacity: 0.5,
		marginTop: 8,
	},
});
