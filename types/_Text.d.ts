interface _TextSizeParams {
  lineHeight: number;
  fontSize: number;
}

interface _TextSizes {
  micro: _TextSizeParams;
  tiny: _TextSizeParams;
  small: _TextSizeParams;
  medium: _TextSizeParams;
  large: _TextSizeParams;
  larger: _TextSizeParams;
  huge: _TextSizeParams;
}

type _TextSize = keyof _TextSizes | _TextSizeParams;

interface _TextProps {
  size?: _TextSize;
  font?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  color?: string;
  textAlign?: 'left' | 'right' | 'center';
  opacity?: number;
}
