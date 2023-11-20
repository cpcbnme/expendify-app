import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { fonts } from "../constants/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../contexts/user.context";
import { ClientTransactionBalance } from "../Helpers/Interfaces/apiResponse";
import Currency from "react-currency-formatter";
import Loading from "./Loading";
// get screen height
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
interface Props {
	isLoading: boolean;
	clientBalance: ClientTransactionBalance;
}
const BalanceCard = ({ isLoading, clientBalance }: Props) => {
	const { user } = useContext(UserContext);
	const firstName = user?.firstName;

	return (
		<View
			className={`bg-accent rounded-lg shadow-lg p-5 justify-between mr-2`}
			style={{
				height: screenHeight / 4.4,
				width: screenWidth / 1.2,
			}}
		>
			{isLoading === true ? (
				<Loading />
			) : (
				<>
					<View className="space-y-3">
						<View className="flex flex-row justify-between align-middle items-center">
							<View>
								<Text
									className={`text-white text-lg font-[${fonts.font700}]`}
								>
									{" "}
									Balance de {firstName}
								</Text>
							</View>
						</View>
						<View>
							<Text
								className={`text-white font-extrabold text-3xl font-[${fonts.font700}]`}
							>
								{" "}
								<Currency
									quantity={clientBalance?.balance | 0}
									currency="USD"
								/>
								{/* ₦{clientBalance?.balance} */}
							</Text>
						</View>
					</View>
					<View className="bottom-0">
						<Text
							className={`text-slate-300 text-xs font-[${fonts.font700}]`}
						>
							{" "}
							{clientBalance?.percentage}% de variación en el
							último mes
						</Text>
					</View>
				</>
			)}
		</View>
	);
};

export default BalanceCard;
