import React, { PropsWithChildren } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { useSkeletor } from "../../hooks";
import { Block, BlockScrollViewProps, BlockViewProps } from "../Block";

type OwnProps = {
  /** Pass a specific background view OR just a background color value. Custom components should be 100% height and width. */
  background?: JSX.Element | string;
  hideTopSafeArea?: boolean;
  hideBottomSafeArea?: boolean;
  bottomSafeAreaColor?: string;
  topSafeAreaColor?: string;
  statusBarType?: "default" | "light-content" | "dark-content";
};

export type ScreenProps = OwnProps & (BlockScrollViewProps | BlockViewProps);

export const Screen: React.FC<PropsWithChildren<ScreenProps>> = ({
  background,
  children,
  hideBottomSafeArea,
  hideTopSafeArea,
  bottomSafeAreaColor,
  topSafeAreaColor,
  statusBarType,
  paddings = {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flex = 1,
  ...blockProps
}) => {
  const { defaultStatusBarType } = useSkeletor();

  return (
    <>
      {background &&
        (typeof background === "string" ? (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: background }]}
          />
        ) : (
          <View style={StyleSheet.absoluteFill}>{background}</View>
        ))}

      {!hideTopSafeArea && (
        <SafeAreaView style={{ backgroundColor: topSafeAreaColor }} />
      )}

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={statusBarType || defaultStatusBarType}
      />

      <Block flex={flex} paddings={paddings} {...blockProps}>
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
