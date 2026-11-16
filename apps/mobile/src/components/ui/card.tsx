import { View, type ViewProps } from 'react-native';

import { radius } from '@/src/constants/theme';
import { makeStyles } from '@/src/theme/theme-provider';

type CardProps = ViewProps & {
  // outlined : carte mise en avant (bordure visible), ex. la séance du jour
  variant?: 'default' | 'outlined';
};

export function Card({ variant = 'default', style, ...rest }: CardProps) {
  const styles = useStyles();
  return <View style={[styles.base, variant === 'outlined' && styles.outlined, style]} {...rest} />;
}

const useStyles = makeStyles((palette) => ({
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
}));
