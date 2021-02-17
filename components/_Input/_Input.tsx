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
  onUpdate: (prop: any, value: any, validate?: boolean) => void;
  prop: string;
  value: string | number;
  nextInput?: React.MutableRefObject<TextInput | null>;
  validateOnChange?: boolean;
  label?: string | JSX.Element;
  isValid: boolean | undefined;
  error?: string | JSX.Element;
};

type Props = Omit<TextInputProps, 'value'> &
  InputProps &
  SpacingProps &
  SizeProps &
  AlignmentProps;

// eslint-disable-next-line react/display-name
/** This is an input field prepared for use with the useForm hook. It only supports a numeric and string value. For other value types, create a custom component */
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
      value,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const isNumeric = typeof value === 'number';

    function onChangeText(text: string) {
      onUpdate(prop, isNumeric ? Number(text) : text, validateOnChange);
    }

    function onDone(event: NativeSyntheticEvent<TextInputEndEditingEventData>) {
      const { text } = event.nativeEvent;
      onUpdate(prop, isNumeric ? Number(text) : text, true);
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
          value={String(value)}
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
