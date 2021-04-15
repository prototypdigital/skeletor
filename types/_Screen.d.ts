type _ScreenProps = {
  /** Pass a specific background view OR just a background color value. Custom components should be 100% height and width. */
  background?: JSX.Element | string;
  header?: JSX.Element;
  disableAndroidBack?: boolean;
  footer?: JSX.Element;
  hideTopSafeArea?: boolean;
  hideBottomSafeArea?: boolean;
  bottomSafeAreaColor?: string;
  topSafeAreaColor?: string;
  statusBarType?: 'default' | 'light-content' | 'dark-content';
  isLandscape?: boolean;
};
