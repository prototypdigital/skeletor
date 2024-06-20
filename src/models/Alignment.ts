import type { ViewStyle } from "react-native";

export interface Alignment {
	align?: ViewStyle["alignItems"];
	alignSelf?: ViewStyle["alignSelf"];
	justify?: ViewStyle["justifyContent"];
	flexDirection?: ViewStyle["flexDirection"];
}
