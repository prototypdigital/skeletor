import { StyleSheet } from 'react-native';
import { Color, Spacing } from 'skeletor/const';
import { TextSizeStyles } from './TextConfig';

export const InputConfig = StyleSheet.create({
  /** The container wrapping the label, input and error message */
  container: {
    marginVertical: Spacing.Sml,
  },
  /** The input component itself */
  input: {
    height: 50,
    width: '100%',
    ...TextSizeStyles.sml,
  },
  /** The input component itself, but a multiline version (a textarea) */
  textarea: {
    width: '100%',
    minHeight: 150,
    color: Color.Text,
    ...TextSizeStyles.sml,
  },
  /** When input is disabled */
  disabled: {
    opacity: 0.5,
  },
  /** When input is focused */
  focused: {},
  /** When input is invalid */
  errored: {},
});
