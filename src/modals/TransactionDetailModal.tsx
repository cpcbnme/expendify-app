import { View, Text, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationTopBar from "../components/NavigationTopBar";
import TransactionIcon from "../components/TransactionIcon";
import TransactionDetailCategory from "../components/TransactionDetailCategory";
import { colors } from "../constants/globalStyles";
import { useTransactionDetailFetch } from "../hooks/useTransactionDetailFetch";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Loading from "../components/Loading";
import Currency from "react-currency-formatter";
// screen width
const screenWidth = Dimensions.get("window").width;
// 80% of screen width
const width = screenWidth * 0.8;

const TransactionDetailModal = ({ route, navigation }) => {
	const { transactionId } = route.params;
	const { transaction, isLoading, error } =
		useTransactionDetailFetch(transactionId);
	// useEffect(() => {
	//   handleFetchTransaction(transactionId);
	// }, [transactionId]);

	if (error) {
		Toast.show({
			type: "error",
			text1: "Error",
			text2: "Something went wrong",
		});
	}

	return (
		<SafeAreaView className="bg-themeGrey h-full mx-auto px-5 w-full">
			{isLoading === true && !transaction ? (
				<Loading />
			) : (
				<>
					<NavigationTopBar
						withFilter={false}
						text="Detalles de la transacción"
					/>
					<View className="px-4">
						<TransactionIcon title={transaction?.title} />
						<View className="flex justify-center items-center">
							<TransactionDetailCategory
								title={transaction?.categoryName}
								icon={transaction?.categoryIcon}
							/>
						</View>
						<View className="flex justify-center items-center my-4">
							<View className="flex space-y-5">
								<View
									className="rounded-xl py-6 px-4 bg-white flex space-y-4"
									style={{ width: width }}
								>
									<View className="flex flex-row justify-between ">
										<View>
											<Text className="text-[#6C727F]">
												Tipo de transacción
											</Text>
										</View>
										<View className="text-right">
											<Text
												className={
													transaction?.inFlow
														? "text-green-500" +
														  " text-right"
														: "text-red-500" +
														  " text-right"
												}
											>
												{transaction?.inFlow
													? "Ingreso"
													: "Gasto"}
											</Text>
										</View>
									</View>
									<View className="flex flex-row justify-between ">
										<View>
											<Text className="text-[#6C727F]">
												Descripción
											</Text>
										</View>
										<View className="text-right">
											<Text className="text-right">
												{transaction?.description}
											</Text>
										</View>
									</View>
								</View>
								<View
									className="rounded-xl py-6 px-4 bg-[#F9FAFB] flex space-y-4"
									style={{ width: width }}
								>
									<View className="flex flex-row justify-between ">
										<View>
											<Text className="text-[#6C727F]">
												Monto
											</Text>
										</View>
										<View className="text-right">
											{transaction?.inFlow ? (
												<Text className="text-green-500">
													+
													<Currency
														quantity={
															transaction?.amount ||
															0
														}
														currency="USD"
													/>
												</Text>
											) : (
												<Text className="text-red-500">
													-
													<Currency
														quantity={
															transaction?.amount ||
															0
														}
														currency="USD"
													/>
												</Text>
											)}
										</View>
									</View>
								</View>
								<View
									className="rounded-xl py-6 px-4 bg-white flex space-y-4"
									style={{ width: width }}
								>
									<View className="flex flex-row justify-between ">
										<View>
											<Text className="text-[#6C727F]">
												Fecha de transacción
											</Text>
										</View>
										<View className="text-right">
											<Text className="text-right">
												{
													transaction?.dateAddedFormatted
												}
											</Text>
										</View>
									</View>
									<View className="flex flex-row justify-between ">
										<View>
											<Text className="text-[#6C727F]">
												Hora de transacción
											</Text>
										</View>
										<View className="text-right">
											<Text className="text-right">
												{new Date(
													new Date(
														transaction?.dateAdded
													).getTime() -
														5 * 60 * 60 * 1000
												)
													.toTimeString()
													.slice(0, 5)}
											</Text>
										</View>
									</View>
								</View>
							</View>
						</View>
					</View>
				</>
			)}
		</SafeAreaView>
	);
};

export default TransactionDetailModal;
