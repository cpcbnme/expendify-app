import {
	View,
	Text,
	SafeAreaView,
	Image,
	StatusBar,
	TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import assetsObject from "../../constants/assets";
import { ONBOARDING } from "../../constants/screenRoutes";
const Splash = () => {
	const navigation = useNavigation();
	useLayoutEffect(() => {
		setTimeout(() => {
			navigation.navigate(ONBOARDING);
		}, 3000);
	});
	// regex for number
	return (
		<SafeAreaView className="flex-1 flex justify-center items-center bg-accent">
			<TouchableOpacity onPress={() => navigation.navigate(ONBOARDING)}>
				<StatusBar />
				<View className="flex items-center">
					<Image
						source={assetsObject.defualtProfile}
						className="rounded-full"
						style={{
							width: 65,
							height: 67,
							resizeMode: "contain",
						}}
					/>
					<Text className="text-white font-bold text-3xl">
						Expendify
					</Text>
					<Text className="text-white">Primero tus finanzas💰</Text>
				</View>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default Splash;
