import React from 'react';
import {
  _Container,
  _Image,
  _Screen,
  _Text,
  _Wrapper,
} from 'skeletor/components';
import { TextSizeStyles } from 'skeletor/config';
import { Color, Spacing } from 'skeletor/const';

/**
 * This is a showcase of Skeletor components
 */
export const SkeletorDemo: React.FC = () => {
  function renderText(size: keyof typeof TextSizeStyles) {
    return <_Text size={size}>{size}</_Text>;
  }

  function renderColor(color: string, title: string) {
    return (
      <_Wrapper
        flexDirection="row"
        align="center"
        margins={{ marginBottom: Spacing.Sml }}
      >
        <_Wrapper width={20} height={20} style={{ backgroundColor: color }} />
        <_Text margins={{ marginLeft: Spacing.Sml }}>{title}</_Text>
      </_Wrapper>
    );
  }

  return (
    <_Screen style={{ borderWidth: 1, borderColor: 'blue' }}>
      <_Text color="blue">{`<_Screen>`}</_Text>

      <_Container
        scrollable
        justify="space-between"
        margins={{ margin: Spacing.Sml }}
        style={{ borderWidth: 1, borderColor: 'green' }}
      >
        <_Wrapper>
          <_Text color="green">{`<_Container>`}</_Text>

          <_Wrapper
            margins={{ margin: Spacing.Sml }}
            style={{ borderWidth: 1, borderColor: 'red' }}
          >
            <_Text color="red">{`<_Wrapper>`}</_Text>

            <_Text
              margins={{ margin: Spacing.Sml }}
              color="black"
              style={{ borderWidth: 1, borderColor: 'black' }}
            >
              {`<_Text></_Text>`}
            </_Text>

            <_Image
              style={{ borderWidth: 1, borderColor: 'purple' }}
              margins={{ margin: Spacing.Sml }}
              width={100}
              height={100}
              source={{
                uri:
                  'https://freepikpsd.com/wp-content/uploads/2019/10/skeletor-png-8-Transparent-Images.png',
              }}
            />

            <_Text color="red">{`<_Wrapper>`}</_Text>
          </_Wrapper>

          <_Wrapper margins={{ margin: Spacing.Sml }}>
            {renderText('tny')}
            {renderText('sml')}
            {renderText('med')}
            {renderText('lrg')}
            {renderText('xlrg')}
            {renderText('xxlrg')}
            {renderText('xxxlrg')}
            {renderText('huge')}
          </_Wrapper>

          <_Wrapper margins={{ margin: Spacing.Sml }}>
            {renderColor(Color.Primary, 'Color Primary')}
            {renderColor(Color.Secondary, 'Color Secondary')}
            {renderColor(Color.Background, 'Color Background')}
            {renderColor(Color.Border, 'Color Border')}
            {renderColor(Color.Danger, 'Color Danger')}
            {renderColor(Color.Success, 'Color Success')}
            {renderColor(Color.Text, 'Color Text')}
          </_Wrapper>
        </_Wrapper>

        <_Wrapper margins={{ margin: Spacing.Sml }}>
          <_Text size="lrg">Inputs:</_Text>
        </_Wrapper>

        <_Wrapper>
          <_Text color="green">{`<_Container>`}</_Text>
        </_Wrapper>
      </_Container>

      <_Text color="blue">{`</_Screen>`}</_Text>
    </_Screen>
  );
};
