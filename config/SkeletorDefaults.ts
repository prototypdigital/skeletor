import { SkeletorConfig } from 'skeletor/models';

export const SkeletorDefaults: SkeletorConfig = {
  general: {
    defaultStatusBarType: 'dark-content',
  },
  _Button: {
    height: 40,
    paddings: { paddingHorizontal: 20, paddingVertical: 10 },
    margins: { marginVertical: 10 },
    minWidth: 100,
    disabledOpacity: 0.4,
    loadingColor: 'rgb(40, 40, 40)',
    baseStyle: {
      backgroundColor: 'rgb(40, 40, 40)',
    },
    pressedStyle: {
      backgroundColor: 'rgb(50, 50, 50)',
    },
    textStyle: {
      color: 'white',
      textTransform: 'uppercase',
      textAlign: 'center',
    },
  },
  _Text: {
    sizes: {
      micro: { fontSize: 8, lineHeight: 12 },
      tiny: { fontSize: 11, lineHeight: 16 },
      small: { fontSize: 13, lineHeight: 20 },
      medium: { fontSize: 20, lineHeight: 28 },
      large: { fontSize: 25, lineHeight: 32 },
      larger: { fontSize: 39, lineHeight: 48 },
      huge: { fontSize: 61, lineHeight: 72 },
    },
    defaultSize: 'small',
    defaultColor: 'black',
  },
  _Input: {
    containerStyle: { marginVertical: 8 },
    defaultStyle: {
      height: 50,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    multilineStyle: {
      width: '100%',
      minHeight: 150,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    disabledStyle: { opacity: 0.5 },
    errorStyle: { color: 'red', borderBottomColor: 'red' },
    focusStyle: { borderBottomWidth: 2 },
  },
};
