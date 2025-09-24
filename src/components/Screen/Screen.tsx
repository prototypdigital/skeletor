import type { PropsWithChildren } from "react";
import {
	type ColorValue,
	StatusBar,
	type StatusBarProps,
	type StatusBarStyle,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSkeletor } from "../../hooks";
import { Block, type BlockProps } from "../Block";

type OwnProps = {
	/** Pass a specific background view OR just a background color value. Custom components should be 100% height and width. */
	background?: React.ReactNode | ColorValue;
	hideTopSafeArea?: boolean;
	hideBottomSafeArea?: boolean;
	bottomSafeAreaColor?: ColorValue;
	topSafeAreaColor?: ColorValue;
	statusBarType?: StatusBarStyle;
	statusBarBackground?: ColorValue;
	/** When set to true, the application will draw under the status bar. */
	statusBarTranslucent?: StatusBarProps["translucent"];
};

export type ScreenProps = OwnProps & Omit<BlockProps, "flex">;

export const Screen: React.FC<PropsWithChildren<ScreenProps>> = ({
	background,
	children,
	hideBottomSafeArea,
	hideTopSafeArea,
	bottomSafeAreaColor,
	topSafeAreaColor,
	statusBarType,
	statusBarBackground,
	statusBarTranslucent,
	paddings,
	...blockProps
}) => {
	const {
		defaultStatusBarType,
		defaultStatusBarBackground,
		defaultStatusBarTranslucent,
	} = useSkeletor();

	return (
		<>
			{background &&
				(typeof background === "string" ? (
					<Block
						style={[StyleSheet.absoluteFill, { backgroundColor: background }]}
					/>
				) : (
					<Block style={StyleSheet.absoluteFill}>{background}</Block>
				))}

			<StatusBar
				translucent={
					statusBarTranslucent || defaultStatusBarTranslucent || false
				}
				barStyle={statusBarType || defaultStatusBarType}
				backgroundColor={
					statusBarBackground || defaultStatusBarBackground || "transparent"
				}
			/>

			{!hideTopSafeArea && (
				<SafeAreaView style={{ backgroundColor: topSafeAreaColor }} />
			)}

			<Block flex={1} paddings={paddings} {...blockProps}>
				{children}
			</Block>

			{!hideBottomSafeArea && (
				<SafeAreaView
					style={{
						backgroundColor: bottomSafeAreaColor,
					}}
				/>
			)}
		</>
	);
};
