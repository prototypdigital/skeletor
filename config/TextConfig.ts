import { StyleSheet } from 'react-native';

export const TextSizeStyles = StyleSheet.create({
  /** Define base text values such as font family, size, line height */
  tny: {
    fontSize: 11,
    lineHeight: 16,
  },
  sml: {
    fontSize: 13,
    lineHeight: 20,
  },
  med: {
    fontSize: 20,
    lineHeight: 28,
  },
  lrg: {
    fontSize: 25,
    lineHeight: 32,
  },
  xlrg: {
    fontSize: 31,
    lineHeight: 36,
  },
  xxlrg: {
    fontSize: 39,
    lineHeight: 48,
  },
  xxxlrg: {
    fontSize: 49,
    lineHeight: 56,
  },
  huge: {
    fontSize: 61,
    lineHeight: 72,
  },
});

export const TextTransformStyles = StyleSheet.create({
  uppercase: {
    textTransform: 'uppercase',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  lowercase: {
    textTransform: 'lowercase',
  },
});

export const TextAlignStyles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  justify: {
    textAlign: 'justify',
  },
});
