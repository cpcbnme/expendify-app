import {
	View,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	Pressable,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import OTPTextView from "react-native-otp-textinput";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import BigBlueButton from "./Components/BigBlueButton";
import {
	requestEmailConfirmationCode,
	verifyEmailConfirmationCode,
} from "../../Helpers/Service/AuthService";
import {
	apiResponse,
	EmailConfirmationPayload,
} from "../../Helpers/Interfaces/apiResponse";
import CustomLoadingComponent from "../../components/CustomLoadingComponent";
import Toast from "react-native-toast-message";
import { LOGIN_SCREEN } from "../../constants/screenRoutes";
import { colors } from "../../constants/globalStyles";
import { isStringNullOrEmptyOrWhiteSpace } from "../../constants/commonHelpers";
const width = Dimensions.get("window").width;

const OtpScreen = ({ route, navigation }) => {
	const [otpInput, setOtpInput] = useState("");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { emailAddress } = route.params;

	useEffect(() => {
		setEmail(emailAddress || "");
	}, [emailAddress]);

	const handleText = (text) => {
		setOtpInput(text);
	};

	const handleRequestForConfirmationCode = async () => {
		setIsLoading(true);
		if (isStringNullOrEmptyOrWhiteSpace(email)) {
			Toast.show({
				type: "error",
				text1: "OTP Request Error",
				text2: "Please try again later.",
			});
		}
		requestEmailConfirmationCode(email)
			.then((res: apiResponse<string>) => {
				if (res.hasError) {
					setIsLoading(false);
					Toast.show({
						type: "error",
						text1: "OTP Request Error",
						text2: res.message,
					});
				} else {
					setIsLoading(false);
					Toast.show({
						type: "success",
						text1: "Success",
						text2: res.message,
					});
				}
			})
			.catch((err) => {
				setIsLoading(false);
				Toast.show({
					type: "error",
					text1: "OTP Request Error",
					text2: err.message,
				});
			});
	};
	const Verify = () => {
		setIsLoading(true);
		if (
			isStringNullOrEmptyOrWhiteSpace(email) ||
			isStringNullOrEmptyOrWhiteSpace(otpInput)
		) {
			Toast.show({
				type: "error",
				text1: "Solicitud OTP fallida",
				text2: "Por favor, vuelve a intentarlo.",
			});
			return;
		}
		const payload = {
			code: otpInput,
			username: email,
		} as EmailConfirmationPayload;
		verifyEmailConfirmationCode(payload)
			.then((res: apiResponse<string>) => {
				if (res.hasError) {
					setIsLoading(false);
					Toast.show({
						type: "error",
						text1: "Solicitud OTP fallida",
						text2: res.message,
					});
				} else {
					setIsLoading(false);
					Toast.show({
						type: "success",
						text1: "OTP Exitoso",
						text2: res.message,
					});
					navigation.navigate(LOGIN_SCREEN);
				}
			})
			.catch((err) => {
				setIsLoading(false);
				Toast.show({
					type: "error",
					text1: "Solicitud OTP fallida",
					text2: err.message,
				});
			});
	};
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
			}}
		>
			<SafeAreaView className="flex-1 mx-4 mt-10">
				<Pressable
					onPress={() => {
						navigation.goBack();
					}}
					className="border border-gray-400 rounded-md p-2 w-[40px]"
				>
					<Ionicons name="chevron-back" size={24} color="black" />
				</Pressable>
				<View className="mt-5 space-y-5">
					<Text className="text-accent text-2xl font-bold max-w-[90%]">
						Confirma tu correo electrónico
					</Text>
					<Text>
						Ingresa el código de 6 dígitos que te enviamos a tu
						correo electrónico.
					</Text>
					<View className="flex flex-row items-center">
						<OTPTextView
							handleTextChange={handleText}
							textInputStyle={styles.roundedTextInput}
							containerStyle={styles.textInputContainer}
							inputCount={6}
							inputCellLength={1}
							tintColor={colors.primary}
						/>
					</View>
					<View>
						<BigBlueButton
							action={Verify}
							buttonName={
								isLoading ? (
									<ActivityIndicator
										size="small"
										color="#fff"
									/>
								) : (
									"Confirmar"
								)
							}
						/>
					</View>
				</View>
				<View className="flex flex-row w-full justify-center mt-10 space-x-2 absolute bottom-8">
					<Text className="font-normal text-lg">
						No recibiste el código?
					</Text>
					<Pressable onPress={handleRequestForConfirmationCode}>
						<Text className="font-semibold text-lg text-accent">
							Reenviar
						</Text>
					</Pressable>
				</View>
				{isLoading ? (
					<CustomLoadingComponent visible={isLoading} />
				) : null}
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	textInputContainer: {
		marginBottom: 5,
		width: width / 1.6,
	},
	roundedTextInput: {
		borderRadius: 5,
		width: "20%",
		height: 60,
		borderWidth: 1,
		fontSize: 20,
		color: colors.primary,
	},
});

export default OtpScreen;
