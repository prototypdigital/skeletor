import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ViewProps,
  BackHandler,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useSkeletor } from 'skeletor/hooks';

import { _Wrapper } from '../_Wrapper';

interface OwnProps {
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
}

type Props = OwnProps & ViewProps;

export const _Screen: React.FC<Props> = ({
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
  const skeletor = useSkeletor();
  function isAndroidBackButtonDisabled() {
    return Boolean(disableAndroidBack);
  }

  /** Disable android back button if need be */
  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      isAndroidBackButtonDisabled,
    );

    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        isAndroidBackButtonDisabled,
      );
  }, [disableAndroidBack]);

  return (
    <>
      {background &&
        (typeof background === 'string' ? (
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
        barStyle={statusBarType || skeletor.defaultStatusBarType}
      />

      <_Wrapper
        paddings={{
          paddingTop:
            Platform.OS === 'android' && !isLandscape
              ? StatusBar.currentHeight || 24
              : 0,
        }}
        flex={1}
        style={style}
        {...rest}
      >
        {header}
        {children}
      </_Wrapper>

      {footer}

      {!hideBottomSafeArea && (
        <SafeAreaView style={{ backgroundColor: bottomSafeAreaColor }} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});
