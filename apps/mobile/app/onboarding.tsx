import { router } from 'expo-router';
import { ArrowRight, Check, Dumbbell } from 'lucide-react-native/icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RestPicker } from '@/src/components/templates/rest-picker';
import { ThemedText } from '@/src/components/themed-text';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Stepper } from '@/src/components/ui/stepper';
import { TERMS_VERSION } from '@/src/constants/legal';
import { palette, radius, spacing, typography } from '@/src/constants/theme';
import { useUserSettings } from '@/src/hooks/user/use-user-settings';

// Premier lancement : prénom, valeurs par défaut des séances et acceptation des CGU
export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { savePreferences } = useUserSettings();
  const [name, setName] = useState('');
  const [seriesPerExercise, setSeriesPerExercise] = useState(4);
  const [repPerSeries, setRepPerSeries] = useState(12);
  const [restBetweenSeries, setRestBetweenSeries] = useState(90);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const start = () => {
    savePreferences({
      isOnboarded: true,
      name: name.trim(),
      // L'autorisation des notifications est demandée au premier repos, quand on en voit l'intérêt
      notifications: false,
      seriesPerExercise,
      repPerSeries,
      restBetweenSeries,
      acceptedTerms: true,
      termsAcceptedAt: Math.floor(Date.now() / 1000),
      termsVersion: TERMS_VERSION,
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: spacing.xxl }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Dumbbell size={30} color={palette.accent} strokeWidth={2.2} pointerEvents="none" />
          </View>
          <ThemedText type="display">Bienvenue sur StrongSet</ThemedText>
          <ThemedText tone="secondary">
            Vos programmes, vos séances et vos records, enregistrés sur votre téléphone. Quelques réglages et c&apos;est
            parti.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="label">Votre prénom</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Facultatif"
            placeholderTextColor={palette.textTertiary}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel="Votre prénom"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="label">Vos séances par défaut</ThemedText>
          <Card style={styles.card}>
            <ThemedText type="caption">Modifiables à tout moment dans les réglages, et programme par programme.</ThemedText>
            <View style={styles.steppers}>
              <Stepper label="Séries par exercice" value={seriesPerExercise} min={1} max={10} onChange={setSeriesPerExercise} />
              <Stepper label="Répétitions" value={repPerSeries} min={1} max={50} onChange={setRepPerSeries} />
            </View>
            <RestPicker value={restBetweenSeries} onChange={setRestBetweenSeries} />
          </Card>
        </View>

        <View style={styles.terms}>
          <Pressable
            onPress={() => setAcceptedTerms((accepted) => !accepted)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acceptedTerms }}
            accessibilityLabel="J'accepte les conditions générales d'utilisation"
            hitSlop={8}
            style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Check size={16} color={palette.onAccent} strokeWidth={3} pointerEvents="none" />}
          </Pressable>
          <ThemedText style={styles.termsText}>
            J&apos;accepte les{' '}
            <ThemedText type="link" onPress={() => router.push({ pathname: '/legal/[document]', params: { document: 'cgu' } })}>
              conditions générales d&apos;utilisation
            </ThemedText>{' '}
            et j&apos;ai lu la{' '}
            <ThemedText
              type="link"
              onPress={() => router.push({ pathname: '/legal/[document]', params: { document: 'confidentialite' } })}>
              politique de confidentialité
            </ThemedText>
            .
          </ThemedText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button title="Commencer" icon={ArrowRight} disabled={!acceptedTerms} onPress={start} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    gap: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  hero: {
    gap: spacing.md,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accentSoft,
  },
  section: {
    gap: spacing.sm,
  },
  input: {
    ...typography.body,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    color: palette.text,
  },
  card: {
    gap: spacing.md,
  },
  steppers: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  checkbox: {
    width: 26,
    height: 26,
    marginTop: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  checkboxChecked: {
    borderColor: palette.accent,
    backgroundColor: palette.accent,
  },
  termsText: {
    flex: 1,
  },
  footer: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: palette.surface,
    backgroundColor: palette.background,
  },
});
