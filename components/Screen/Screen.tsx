import React from "react";
import {
  SafeAreaView,
  View,
  ViewProps,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { useSkeletor } from "../../hooks";
import { Block } from "../Block";

type OwnProps = {
  /** Pass a specific background view OR just a background color value. Custom components should be 100% height and width. */
  background?: JSX.Element | string;
  hideTopSafeArea?: boolean;
  hideBottomSafeArea?: boolean;
  bottomSafeAreaColor?: string;
  topSafeAreaColor?: string;
  statusBarType?: "default" | "light-content" | "dark-content";
  isLandscape?: boolean;
};

type ScreenProps = OwnProps & ViewProps;

export const Screen: ReactFC<ScreenProps> = ({
  background,
  children,
  hideBottomSafeArea,
  hideTopSafeArea,
  bottomSafeAreaColor,
  topSafeAreaColor,
  style,
  statusBarType,
  isLandscape,
  ...rest
}) => {
  const { defaultStatusBarType } = useSkeletor();

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
