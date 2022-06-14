import React from 'react';
import { ScrollView, ViewProps } from 'react-native';
import { $Wrapper } from '../$Wrapper';

type Props = $Alignment & $Size & $ContainerProps & ViewProps;

/** Basically just a full height/width $Wrapper component (flex 1)
 * To be used as the main container within a _Screen component
 */
export const $Container: React.FC<Props> = ({
  children,
  bounces = false,
  scrollable,
  showsVerticalScrollIndicator = false,
  ...rest
}) =>
  scrollable ? (
    <ScrollView
      bounces={bounces}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <$Wrapper {...rest} flex={1}>
        {children}
      </$Wrapper>
    </ScrollView>
  ) : (
    <$Wrapper {...rest} flex={1}>
      {children}
    </$Wrapper>
  );
