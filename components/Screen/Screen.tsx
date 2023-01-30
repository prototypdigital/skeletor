import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  ViewProps,
  BackHandler,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { useSkeletor } from "../../hooks";
import { Block } from "../Block";

export type ScreenProps = {
  /** Pass a specific background view OR just a background color value. Custom components should be 100% height and width. */
  background?: JSX.Element | string;
  header?: JSX.Element;
  disableAndroidBack?: boolean;
  onAndroidBack?: () => void;
  footer?: JSX.Element;
  hideTopSafeArea?: boolean;
  hideBottomSafeArea?: boolean;
  bottomSafeAreaColor?: string;
  topSafeAreaColor?: string;
  statusBarType?: "default" | "light-content" | "dark-content";
  isLandscape?: boolean;
};

type Props = ScreenProps & ViewProps;

export const Screen: ReactFC<Props> = ({
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
  onAndroidBack,
  ...rest
}) => {
  const { defaultStatusBarType } = useSkeletor();

  /** Disable android back button if need be */
  useEffect(() => {
    /** Return true to disable default Android back.
     * Return false to enable default Android back.
     * If onAndroidBack is passed, default back behavior will be disabled.
     */
    function handleAndroidBack() {
      onAndroidBack?.();
      return Boolean(onAndroidBack || disableAndroidBack);
    }

    BackHandler.addEventListener("hardwareBackPress", handleAndroidBack);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleAndroidBack);
  }, [disableAndroidBack, onAndroidBack]);

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

      <Block
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

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  },
});
