import Animated, { 
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

interface ConfettiPieceProps {
  delay: number;
  x: number;
  y: number;
  color: string;
}

export function ConfettiPiece({ delay, x, y, color }: ConfettiPieceProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${Math.random() * 360}deg` },
      ],
      opacity: withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 100 }),
          withDelay(1000, withTiming(0, { duration: 500 }))
        )
      ),
    };
  });

  return (
    <Animated.View style={[styles.confettiPiece, { backgroundColor: color }, animatedStyle]} />
  );
}

const styles = StyleSheet.create({
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});