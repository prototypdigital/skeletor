import React from 'react';
import { ViewProps, ScrollView } from 'react-native';
import { AlignmentProps, SizeProps, SpacingProps } from 'skeletor/models';

import { _Wrapper } from '../_Wrapper';

type Props = AlignmentProps &
  SpacingProps &
  SizeProps &
  ViewProps & {
    scrollable?: boolean;
    showsVerticalScrollIndicator?: boolean;
    bounces?: boolean;
  };

/** Basically just a full height/width _Wrapper component (flex 1)
 * To be used as the main container with i a _Screen component
 */
export const _Container: React.FC<Props> = ({
  children,
  bounces,
  scrollable,
  showsVerticalScrollIndicator,
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
