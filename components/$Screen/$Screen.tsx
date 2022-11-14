import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  ViewProps,
  BackHandler,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useSkeletor } from "../../hooks";
import { $Block } from "../$Block";

type Props = $ScreenProps & ViewProps;

export const $Screen: ReactFC<Props> = ({
  background,
  children,
  disableAndroidBack,
  footer,
  hideBottomSafeArea,
  hideTopSafeArea,
  bottomSafeAreaColor,
  topSafeAreaColor,
  header,
  style,
  statusBarType,
  isLandscape,
  ...rest
}) => {
  const { defaultStatusBarType } = useSkeletor();

  /** Disable android back button if need be */
  useEffect(() => {
    function isAndroidBackButtonDisabled() {
      return Boolean(disableAndroidBack);
    }

    BackHandler.addEventListener(
      "hardwareBackPress",
      isAndroidBackButtonDisabled,
    );

    return () =>
      BackHandler.removeEventListener(
        "hardwareBackPress",
        isAndroidBackButtonDisabled,
      );
  }, [disableAndroidBack]);

  return (
    <>
      {background &&
        (typeof background === "string" ? (
          <View style={[styles.container, { backgroundColor: background }]} />
        ) : (
          <View style={styles.container}>{background}</View>
        ))}

      {!hideTopSafeArea && (
        <SafeAreaView style={{ backgroundColor: topSafeAreaColor }} />
      )}

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={statusBarType || defaultStatusBarType}
      />

      <$Block
        paddings={{
          paddingTop:
            Platform.OS === "android" && !isLandscape
              ? StatusBar.currentHeight || 24
              : 0,
        }}
        flex={1}
        style={style}
        {...rest}
      >
        {header}
        {children}
      </$Block>

      {footer}

      {!hideBottomSafeArea && (
        <SafeAreaView style={{ backgroundColor: bottomSafeAreaColor }} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
});
