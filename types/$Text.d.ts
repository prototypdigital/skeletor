interface $TextSizeParams {
  lineHeight: number;
  fontSize: number;
}

interface $TextSizes {
  micro: $TextSizeParams;
  tiny: $TextSizeParams;
  small: $TextSizeParams;
  medium: $TextSizeParams;
  large: $TextSizeParams;
  larger: $TextSizeParams;
  huge: $TextSizeParams;
}

type $TextSize = keyof $TextSizes | $TextSizeParams;

interface $TextProps {
  size?: $TextSize;
  font?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  color?: string;
  textAlign?: 'left' | 'right' | 'center';
  opacity?: number;
}
