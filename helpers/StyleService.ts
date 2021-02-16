import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export const getUsableStylesFromProps = (
  props: Record<string, unknown>,
): ViewStyle | ImageStyle | TextStyle => JSON.parse(JSON.stringify(props));
