import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { fontFamily, palette, radius } from '@/src/constants/theme';
import { Template } from '@/src/repositories/template/template-type';

// « Full Body » -> « FB », « Chest » -> « CH »
function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2);
  return letters.toUpperCase();
}

export function ProgramRow({ template }: { template: Template }) {
  const exerciseCount = template.exercises.length;

  return (
    <View style={styles.row}>
      <View style={styles.code}>
        <ThemedText style={styles.codeText} tone="accent">
          {initials(template.name)}
        </ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {template.name}
        </ThemedText>
        <ThemedText type="caption" numberOfLines={1}>
          {exerciseCount === 0 ? 'Aucun exercice' : `${exerciseCount} ${exerciseCount > 1 ? 'exercices' : 'exercice'}`}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.surface,
  },
  code: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceRaised,
  },
  codeText: {
    fontFamily: fontFamily.displayBold,
    fontSize: 20,
    lineHeight: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
