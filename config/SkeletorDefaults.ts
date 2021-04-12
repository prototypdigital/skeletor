import { Platform } from 'react-native';
import { SkeletorConfig } from 'skeletor/models';

export const SkeletorDefaults: SkeletorConfig = {
  textSizes: {
    micro: { fontSize: 8, lineHeight: 12 },
    tiny: { fontSize: 11, lineHeight: 16 },
    small: { fontSize: 13, lineHeight: 20 },
    medium: { fontSize: 20, lineHeight: 28 },
    large: { fontSize: 25, lineHeight: 32 },
    larger: { fontSize: 39, lineHeight: 48 },
    huge: { fontSize: 61, lineHeight: 72 },
  },
  defaultColor: 'black',
  defaultStatusBarType: 'dark-content',
  defaultTextSize: 'small',
  defaultFont: Platform.OS === 'ios' ? 'Avenir' : 'monospace',
  inputContainerStyle: { marginVertical: 8 },
  inputDefaultStyle: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  inputMultilineStyle: {
    width: '100%',
    minHeight: 150,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  inputDisabledStyle: { opacity: 0.5 },
  inputErrorStyle: { color: 'red', borderBottomColor: 'red' },
  inputFocusStyle: { borderBottomWidth: 2 },
};
