import React from 'react';
import { ScrollView, ViewProps } from 'react-native';

import { _Wrapper } from '../_Wrapper';

type Props = _Alignment & _Size & _ContainerProps & ViewProps;

/** Basically just a full height/width _Wrapper component (flex 1)
 * To be used as the main container within a _Screen component
 */
export const _Container: React.FC<Props> = ({
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
      <_Wrapper {...rest} flex={1}>
        {children}
      </_Wrapper>
    </ScrollView>
  ) : (
    <_Wrapper {...rest} flex={1}>
      {children}
    </_Wrapper>
  );
