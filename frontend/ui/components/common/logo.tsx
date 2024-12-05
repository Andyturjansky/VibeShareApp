import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Text as SvgText, TSpan, Stop } from 'react-native-svg';

type Size = 'small' | 'medium' | 'large';

type LogoProps = {
  size?: Size;
};

const getFontSize = (size: Size): number => {
  switch (size) {
    case 'large':
      return 40;
    case 'small':
      return 24;
    default:
      return 32;
  }
};

export const Logo = ({ size = 'medium' }: LogoProps) => {
  const gradientId = `gradient-${Math.random()}`; // ID único
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Svg 
        height="50" 
        width={Math.min(200, width * 0.5)}
        style={styles.svg}
      >
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#42E6B2" stopOpacity={1} />
            <Stop offset="100%" stopColor="#CDD002" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <SvgText 
          fill={`url(#${gradientId})`}
          fontSize={getFontSize(size)}
          fontWeight="normal" 
          fontFamily="Poppins-SemiBold"
          textAnchor="middle"
          x="50%"
        >
          <TSpan dy="32">VibeShare</TSpan>
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    alignSelf: 'center',
  },
});

export default Logo;