import React, { useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputEndEditingEventData,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { useSkeletor } from '../../hooks';
import { $Wrapper } from '../$Wrapper';

export type InputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (prop: any, value: any, validate?: boolean) => void;
  onFocusChange?: (focused: boolean) => void;
  prop: string;
  value: string | number;
  nextInput?: React.MutableRefObject<TextInput | null>;
  validateOnChange?: boolean;
  isValid: boolean | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  focusStyle?: StyleProp<TextStyle>;
  disabledStyle?: StyleProp<TextStyle>;
};

type Props = Omit<TextInputProps, 'value'> &
  InputProps &
  $Spacing &
  $Size &
  $Alignment;

/** This is an input field prepared for use with the useForm hook. It only supports a numeric and string value. For other value types, create a custom component */
// eslint-disable-next-line react/display-name
export const $Input = React.forwardRef<TextInput, Props>(
  (
    {
      onUpdate,
      margins,
      paddings,
      nextInput,
      prop,
      editable,
      returnKeyType,
      autoCapitalize,
      style,
      multiline,
      validateOnChange,
      onFocusChange,
      isValid,
      value,
      containerStyle,
      disabledStyle,
      focusStyle,
      errorStyle,
      ...rest
    },
    ref,
  ) => {
    const { $Input: styles } = useSkeletor();
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
      onFocusChange?.(!focused);
      setFocused(!focused);
    }

    function focusNextInput() {
      if (!nextInput || !nextInput.current) {
        return;
      }

      nextInput.current.focus();
    }

    return (
      <$Wrapper
        style={containerStyle || styles.containerStyle}
        margins={margins}
        paddings={paddings}
      >
        <TextInput
          {...rest}
          value={String(value)}
          multiline={multiline}
          editable={editable}
          autoCapitalize={autoCapitalize || 'none'}
          allowFontScaling={false}
          returnKeyType={returnKeyType || nextInput ? 'next' : 'done'}
          onChangeText={onChangeText}
          onEndEditing={onDone}
          onFocus={toggleFocus}
          onBlur={toggleFocus}
          onSubmitEditing={focusNextInput}
          style={[
            multiline ? styles.multilineStyle : styles.defaultStyle,
            style,
            editable === false && (disabledStyle || styles.disabledStyle),
            focused && (focusStyle || styles.focusStyle),
            isValid === false && (errorStyle || styles.errorStyle),
          ]}
          ref={ref}
        />
      </$Wrapper>
    );
  },
);
