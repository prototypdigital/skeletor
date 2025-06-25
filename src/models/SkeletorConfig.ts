import type { ColorValue, StatusBarStyle } from "react-native";

export interface SkeletorConfig {
	defaultFont: Font | undefined;
	defaultFontSize: [number, number] | number;
	defaultStatusBarType: StatusBarStyle;
	/** Defaults to transparent if not set.
	 * Can be overriden via the Screen component per-screen. */
	defaultStatusBarBackground?: ColorValue;
	/** When set to true, the application will draw under the status bar.
	 * Defaults to false if not set.
	 * Can be overriden via the Screen component per-screen. */
	defaultStatusBarTranslucent?: boolean;
	defaultTextColor: ColorValue;
	/** When set to true, font size will scale based on the user's device settings.
	 * Defaults to false */
	allowFontScaling: boolean;
	/** Clamp the maximum font size multiplier that can be applied to the original scale. */
	defaultMaxFontSizeMultiplier?: number;
}
