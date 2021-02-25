import React from 'react';
import {
  _Container,
  _Image,
  _Input,
  _Screen,
  _Text,
  _Wrapper,
} from 'skeletor/components';
import { TextSizeStyles } from 'skeletor/config';
import { Color, Spacing, Validators } from 'skeletor/const';
import { useForm } from 'skeletor/hooks';

/**
 * This is a showcase of Skeletor components
 */
export const SkeletorDemo: React.FC = () => {
  const { state, validation, onUpdate } = useForm(
    {
      text: '',
      number: 0,
      email: '',
      password: '',
    },
    { rules: { email: Validators.email, password: Validators.password } },
  );
  const { text, number, email, password } = state;

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
          {/* Basic text input */}
          <_Input
            label="Text input"
            placeholder="Text validation"
            style={{ borderWidth: 1 }}
            isValid={validation.text}
            onUpdate={onUpdate}
            prop="text"
            value={text}
          />

          {/* Use keyboardType="number-pad" for numeric keyboard  */}
          <_Input
            keyboardType="number-pad"
            label="Number input"
            placeholder="Number validation"
            style={{ borderWidth: 1 }}
            isValid={validation.number}
            onUpdate={onUpdate}
            prop="number"
            value={number}
            error="NaN"
          />

          {/* Use Validation.email as rule in useForm hook for email validation */}
          <_Input
            label="Email input"
            placeholder="Email validation"
            style={{ borderWidth: 1 }}
            isValid={validation.email}
            onUpdate={onUpdate}
            prop="email"
            value={email}
            error="Not an email address"
          />

          {/* 
            Use Validation.password as rule in useForm hook for basic password validation
            secureTextEntry for hidding characters
          */}
          <_Input
            secureTextEntry
            label="Password input"
            placeholder="Password validation"
            style={{ borderWidth: 1 }}
            isValid={validation.password}
            onUpdate={onUpdate}
            prop="password"
            value={password}
            error="6 characters needed"
          />
        </_Wrapper>

        <_Wrapper>
          <_Text color="green">{`<_Container>`}</_Text>
        </_Wrapper>
      </_Container>

      <_Text color="blue">{`</_Screen>`}</_Text>
    </_Screen>
  );
};
