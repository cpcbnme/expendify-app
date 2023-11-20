import {
	View,
	Text,
	SafeAreaView,
	Pressable,
	TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../contexts/user.context";
import { RESET_PASSWORD_PROFILE } from "../../constants/screenRoutes";
import * as Application from "expo-application";

const Settings = () => {
	const navigation = useNavigation();
	const appVersion = Application.nativeApplicationVersion;
	const { signOutUser } = useContext(UserContext);

	const handleSignOut = async () => {
		await signOutUser();
	};
	return (
		<SafeAreaView className="mt-10 mx-4 space-y-10">
			<View className="w-3/5 flex flex-row justify-between items-center">
				<Pressable
					onPress={() => {
						navigation.goBack();
					}}
					className="rounded-full bg-white p-3"
				>
					<Ionicons name="chevron-back" size={24} color="black" />
				</Pressable>
				<Text className="font-bold text-lg">Ajustes</Text>
			</View>
			<View className="space-y-4">
				<Text className="text-gray-400 text-base">General</Text>
				<Pressable
					onPress={() => {
						navigation.navigate(RESET_PASSWORD_PROFILE);
					}}
					className="flex flex-row justify-between"
				>
					<Text className="font-semibold text-base">
						Cambiar contraseña
					</Text>
					<AntDesign name="right" size={20} color="black" />
				</Pressable>
				<View className="flex flex-row justify-between">
					<Text className="font-semibold text-base">
						Notificaciones
					</Text>
					<AntDesign name="right" size={20} color="black" />
				</View>
			</View>
			<View className="space-y-4">
				<Text className="text-gray-400 text-base">Seguridad</Text>
				<View className="flex flex-row justify-between">
					<Text className="font-semibold text-base">
						Política de privacidad
					</Text>
					<AntDesign name="right" size={20} color="black" />
				</View>
				<Text className="text-gray-400 ">
					elige los datos que quieres compartir con nosotros
				</Text>
			</View>
			<View className=" w-full h-[30%] flex flex-row items-end">
				<TouchableOpacity
					className="rounded-md h-16 w-full border border-gray-400 flex flex-row justify-center items-center"
					onPress={handleSignOut}
				>
					<Text className="text-accent font-bold">Salir</Text>
				</TouchableOpacity>
			</View>
			<View>
				<Text className="text-gray-300 text-center">
					V {appVersion}
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default Settings;
