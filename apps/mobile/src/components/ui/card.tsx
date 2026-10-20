import { StyleSheet, View, type ViewProps } from 'react-native';

import { palette, radius } from '@/src/constants/theme';

type CardProps = ViewProps & {
  // outlined : carte mise en avant (bordure visible), ex. la séance du jour
  variant?: 'default' | 'outlined';
};

export function Card({ variant = 'default', style, ...rest }: CardProps) {
  return <View style={[styles.base, variant === 'outlined' && styles.outlined, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.surface,
  },
  outlined: {
    borderColor: palette.border,
  },
});
