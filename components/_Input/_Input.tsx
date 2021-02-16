import React, { useState } from 'react';
import {
  TextInputProps,
  TextInput,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from 'react-native';

import { AlignmentProps, SizeProps, SpacingProps } from 'skeletor/models';
import { Color } from 'skeletor/const';
import { _Label, _Error, _Wrapper } from 'skeletor/components';
import { InputConfig } from 'skeletor/config';

export type InputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (prop: any, text: string, validate?: boolean) => void;
  prop: string;
  value: string;
  nextInput?: React.MutableRefObject<TextInput | null>;
  validateOnChange?: boolean;
  label?: string | JSX.Element;
  isValid: boolean | undefined;
  error?: string | JSX.Element;
};

type Props = TextInputProps &
  InputProps &
  SpacingProps &
  SizeProps &
  AlignmentProps;

// eslint-disable-next-line react/display-name
export const _Input = React.forwardRef<TextInput, Props>(
  (
    {
      onUpdate,
      margins,
      paddings,
      nextInput,
      prop,
      returnKeyType,
      editable,
      autoCapitalize,
      style,
      placeholder,
      multiline,
      validateOnChange,
      label,
      isValid,
      error,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    function onChangeText(text: string) {
      onUpdate(prop, text, validateOnChange);
    }

    function onDone(event: NativeSyntheticEvent<TextInputEndEditingEventData>) {
      const { text } = event.nativeEvent;
      onUpdate(prop, text, true);
    }

    function toggleFocus() {
      setFocused(!focused);
    }

    function focusNextInput() {
      if (!nextInput || !nextInput.current) {
        return;
      }

      nextInput.current.focus();
    }

    return (
      <_Wrapper
        style={InputConfig.container}
        margins={margins}
        paddings={paddings}
      >
        {Boolean(label) && (
          <_Label
            status={
              focused ? 'focused' : isValid === false ? 'errored' : 'default'
            }
          >
            {label}
          </_Label>
        )}
        <TextInput
          {...rest}
          multiline={multiline}
          editable={editable}
          autoCapitalize={autoCapitalize || 'none'}
          allowFontScaling={false}
          returnKeyType={returnKeyType || nextInput ? 'next' : 'done'}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onEndEditing={onDone}
          onFocus={toggleFocus}
          onBlur={toggleFocus}
          onSubmitEditing={focusNextInput}
          style={[
            multiline ? InputConfig.textarea : InputConfig.input,
            style,
            editable === false && InputConfig.disabled,
            focused && InputConfig.focused,
            isValid === false && InputConfig.errored,
          ]}
          ref={ref}
        />
        {isValid === false && <_Error color={Color.Danger}>{error}</_Error>}
      </_Wrapper>
    );
  },
);
