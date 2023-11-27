import {
	View,
	Text,
	TextInput,
	Image,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
	TouchableOpacity,
	Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import assetsObject from "../../constants/assets";
import { LOGIN, OTPSCREEN } from "../../constants/screenRoutes";
import BigBlueButton from "./Components/BigBlueButton";
import Toast from "react-native-toast-message";
import CustomLoadingComponent from "../../components/CustomLoadingComponent";
import {
	apiResponse,
	AuthResponse,
	RegisterPayload,
} from "../../Helpers/Interfaces/apiResponse";
import {
	loginOrRegisterWithGoogle,
	register,
} from "../../Helpers/Service/AuthService";
import {
	isEqual,
	isStringNullOrEmptyOrWhiteSpace,
	isValidEmail,
	isValidPassword,
} from "../../constants/commonHelpers";
import { UserContext } from "../../contexts/user.context";
import * as Google from "expo-auth-session/providers/google";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = () => {
	const navigation = useNavigation();
	const [username, setUsername] = useState("");
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");
	const [ConfirmPassword, setConfirmPassword] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [textinputBorder, setTextInputBorder] = useState("border-gray-400");
	const [isLoading, setIsLoading] = useState(false);
	const [accessToken, setAccessToken] = useState("");
	const [checklist, setChecklist] = useState([
		{ label: "Al menos 6 caracteres", done: false },
		{ label: "Debe contener una mayuscula", done: false },
		{ label: "Contiene un numero", done: false },
		{ label: "Contiene un caracter especial", done: false },
	]);

	const { signInUser } = useContext(UserContext);

	const handleUsername = (val) => {
		setUsername(val);
	};
	const handleEmail = (val) => {
		setTextInputBorder("border-red-700");
		setEmail(val);
	};
	const handlePassword = (val) => {
		setPassword(val);

		// Update checklist
		const updatedChecklist = [...checklist];
		updatedChecklist[0].done = val.length >= 6;
		updatedChecklist[1].done = /[A-Z]/.test(val);
		updatedChecklist[2].done = /\d/.test(val);
		updatedChecklist[3].done = /[@$!%*#?&]/.test(val);
		setChecklist(updatedChecklist);
	};
	const handleConfirmPassword = (val) => {
		setConfirmPassword(val);
	};
	const GotoLogin = () => {
		navigation.navigate(LOGIN);
	};
	const GotoOTP = () => {
		navigation.navigate(OTPSCREEN, {
			emailAddress: Email,
		});
	};

	const handleRegister = () => {
		if (isValidEmail(Email) && isEqual(Password, ConfirmPassword)) {
			const isValidPass = isValidPassword(Password);

			console.log(isValidPass);

			if (isValidPass.isValid) {
				try {
					setIsLoading(true);
					const payload: RegisterPayload = {
						email: Email,
						password: Password,
						firstName: firstname,
						lastName: lastname,
						phoneNumber: phoneNumber,
						userName: username,
					};
					register(payload)
						.then((res: apiResponse<string>) => {
							if (res.hasError) {
								setIsLoading(false);
								Toast.show({
									type: "error",
									text1: "Error al registrarse",
									text2:
										res.message === "User already exists"
											? "El usuario ya existe"
											: res.message,
								});
							} else {
								setIsLoading(false);
								Toast.show({
									type: "success",
									text1: "Registro exitoso",
									text2: res.message,
								});
								GotoOTP();
							}
						})
						.catch((err) => {
							setIsLoading(false);
							Toast.show({
								type: "error",
								text1: "Register Error",
								text2: err.message,
							});
						});
				} catch (error) {
					setIsLoading(false);
					Toast.show({
						type: "error",
						text1: "Error al registrarse",
						text2: error.message,
					});
				}
			} else {
				Toast.show({
					type: "error",
					text1: "Contraseña no válida",
					text2: isValidPass.message,
				});
			}
		} else {
			Toast.show({
				type: "error",
				text1: "Error al registrarse",
				text2: "El correo electrónico no es válido o las contraseñas no coinciden",
			});
		}
	};
	const CheckValidation = () => {
		if (isValidEmail(Email)) {
			setTextInputBorder("border-gray-400");
		}
	};
	const [request, response, promptAsync] = Google.useAuthRequest({
		//TODO: Pick from .env file
		androidClientId:
			"161946807233-s4qukrgk8dvcebe65gp2387n38ceascf.apps.googleusercontent.com",
		expoClientId:
			"916977843040-nrncesmq80cl3kiv66ldgt5gk0s40942.apps.googleusercontent.com",
		iosClientId:
			"161946807233-5jmbfv2uhvghkmnces7q69i7vruh0dop.apps.googleusercontent.com",
		// redirectUri: makeRedirectUri({
		// 	scheme: "com.piscesmetadata.expendify",
		// }),
		redirectUri: "com.piscesmetadata.expendify:///",
	});
	useEffect(() => {
		if (response?.type === "success") {
			setAccessToken("");
			setAccessToken(response.authentication.idToken);
			registerWithGoogle();
		}
	}, [response, accessToken]);

	const registerWithGoogle = async () => {
		try {
			if (isStringNullOrEmptyOrWhiteSpace(accessToken)) return;
			setIsLoading(true);
			loginOrRegisterWithGoogle(accessToken).then(
				(res: apiResponse<AuthResponse>) => {
					if (res.hasError) {
						setIsLoading(false);
						Toast.show({
							type: "error",
							text1: "Error al registrarse",
							text2: res.message,
						});
						return;
					}
					if (!res.data) {
						setIsLoading(false);
						Toast.show({
							type: "error",
							text1: "Error al registrarse",
							text2: "Intente de nuevo",
						});
						return;
					}
					signInUser(res.data).then(() => {
						setIsLoading(false);
						Toast.show({
							type: "success",
							text1: "Registro exitoso",
							text2: `Bienvenido, ${res?.data?.firstName}`,
						});
					});
				}
			);
		} catch (error) {
			setIsLoading(false);
			Toast.show({
				type: "error",
				text1: "Unknown Error",
				text2: "Please try again",
			});
		}
	};

	const handleSignUpWithGoogle = async () => {
		await promptAsync({ showInRecents: true, useProxy: true });
	};

	const isIos = Platform.OS === "ios";
	return (
		<ScrollView>
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}
			>
				<SafeAreaView className="flex-1 mx-4">
					<View className="mt-5 space-y-5">
						<Text className="text-accent text-2xl font-bold">
							Hola, registraste para empezar
						</Text>
						<View className="space-y-4">
							<TextInput
								onChangeText={(text) => {
									handleUsername(text);
								}}
								value={username}
								placeholder="Nombre de usuario"
								placeholderTextColor="gray"
								className="text-sm border border-gray-400 h-[56px] pl-4 bg-inputBackground rounded-md"
							/>
							<TextInput
								onChangeText={(text) => {
									setFirstname(text);
								}}
								value={firstname}
								placeholder="Nombre"
								placeholderTextColor="gray"
								className="text-sm border border-gray-400 h-[56px] pl-4 bg-inputBackground rounded-md"
							/>
							<TextInput
								onChangeText={(text) => {
									setLastname(text);
								}}
								value={lastname}
								placeholder="Apellido"
								placeholderTextColor="gray"
								className="text-sm border border-gray-400 h-[56px] pl-4 bg-inputBackground rounded-md"
							/>
							<TextInput
								onChangeText={(text) => {
									handleEmail(text);
								}}
								value={Email}
								onEndEditing={CheckValidation}
								placeholder="Correo electrónico"
								placeholderTextColor="gray"
								className={`text-sm border ${textinputBorder} h-[56px] pl-4 bg-inputBackground rounded-md`}
							/>
							<TextInput
								onChangeText={(text) => {
									setPhoneNumber(text);
								}}
								value={phoneNumber}
								placeholder="Numero telefonico"
								placeholderTextColor="gray"
								className="text-sm border border-gray-400 h-[56px] pl-4 bg-inputBackground rounded-md"
							/>
							<TextInput
								onChangeText={(text) => {
									handlePassword(text);
								}}
								value={Password}
								placeholder="Contraseña"
								placeholderTextColor="gray"
								className="text-sm border border-gray-400 h-[56px] pl-4 bg-inputBackground rounded-md"
								secureTextEntry={true}
							/>
							<View className="flex-col flex-wrap items-start">
								{checklist.map((item, index) => (
									<View
										key={index}
										className="flex-row items-center my-2 mr-4"
									>
										<Text
											className={
												item.done
													? `text-gray-400 line-through`
													: `text-gray-700`
											}
										>
											{item.label}
										</Text>
										{item.done ? (
											<View className="bg-accent rounded-full w-4 h-4 ml-2" />
										) : (
											<View className="border border-gray-300 rounded-full w-4 h-4 ml-2" />
										)}
									</View>
								))}
							</View>
							<TextInput
								onChangeText={(text) => {
									handleConfirmPassword(text);
								}}
								value={ConfirmPassword}
								placeholder="Confirmar contraseña"
								placeholderTextColor="gray"
								className="text-sm border border-gray-400 h-[56px] pl-4 bg-inputBackground rounded-md"
								secureTextEntry={true}
							/>
						</View>
						<View className="space-y-5">
							<BigBlueButton
								action={handleRegister}
								buttonName="Registrarse"
							/>
							{isIos && (
								<>
									<View className="flex flex-row justify-around">
										<Image
											source={assetsObject.line}
											className="w-[105px] mt-2"
										/>
										<Text className="text-gray-900 text-center font-semibold">
											También puedes
										</Text>
										<Image
											source={assetsObject.line}
											className="w-[105px] mt-2"
										/>
									</View>
								</>
							)}
						</View>
						<View className="flex flex-row space-x-2">
							{isIos && (
								<TouchableOpacity
									className="border border-gray-400 rounded-md p-2 flex flex-row justify-center items-center w-full space-x-2 h-12"
									onPress={handleSignUpWithGoogle}
								>
									<FontAwesome5
										name="google"
										size={20}
										color="black"
									/>
									<Text className="text-gray-900 text-center font-semibold">
										Registrarte con Google
									</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
					<View className="flex flex-row w-full justify-center space-x-2 my-4">
						<TouchableOpacity onPress={GotoLogin}>
							<Text className="font-semibold text-base text-accent">
								Ya tengo una cuenta
							</Text>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			</TouchableWithoutFeedback>
			{isLoading ? <CustomLoadingComponent visible={isLoading} /> : null}
		</ScrollView>
	);
};

export default RegisterScreen;
