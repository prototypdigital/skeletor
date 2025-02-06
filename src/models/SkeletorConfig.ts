export interface SkeletorConfig {
  defaultFont: Font | undefined;
  defaultFontSize: [number, number] | number;
  defaultStatusBarType: "dark-content" | "light-content" | "default";
  defaultTextColor: string;
  /** Defaults to false */
  allowFontScaling: boolean;
  /** Defaults to 1 */
  maxFontSizeMultiplier: number;
}
