import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/components/themed-text';
import { palette, spacing } from '@/src/constants/theme';
import { LEGAL_UPDATED_AT, PRIVACY, TERMS } from '@/src/constants/legal';

const DOCUMENTS = { cgu: TERMS, confidentialite: PRIVACY };

// CGU (/legal/cgu) ou politique de confidentialité (/legal/confidentialite)
export default function LegalScreen() {
  const { document } = useLocalSearchParams<{ document: string }>();
  const insets = useSafeAreaInsets();
  const content = document === 'confidentialite' ? DOCUMENTS.confidentialite : DOCUMENTS.cgu;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
      <Stack.Screen options={{ title: content.title }} />
      <ThemedText type="caption">Dernière mise à jour : {LEGAL_UPDATED_AT}</ThemedText>
      {content.sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <ThemedText type="heading">{section.title}</ThemedText>
          {section.paragraphs.map((paragraph) => (
            <ThemedText key={paragraph} tone="secondary">
              {paragraph}
            </ThemedText>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
});
