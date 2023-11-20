import { View, Text, Image } from "react-native";
import React from "react";
import { colors, fonts } from "../constants/globalStyles";
import { FontAwesome5, Octicons } from "@expo/vector-icons";

const TopBar = () => {
	return (
		<View className="flex flex-row justify-between mx-auto mb-4 items-center w-full">
			<View className="flex space-x-2 flex-row">
				<View>
					<Text
						className={`text-xl font-black text-[${colors.boldPrimary}] font-[${fonts.font700}]`}
					>
						Expendify
					</Text>
				</View>
			</View>
			<View>
				{/* <FontAwesome5 name='bars' size={24} color='black' /> */}
			</View>
		</View>
	);
};
export default TopBar;
