import { Flame } from 'lucide-react-native/icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { Card } from '@/src/components/ui/card';
import { fontFamily, palette } from '@/src/constants/theme';

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export type WeekDay = {
  date: Date;
  isToday: boolean;
  // Au moins une séance enregistrée ce jour-là
  hasWorkout: boolean;
};

export function WeekStrip({ days }: { days: WeekDay[] }) {
  const workoutCount = days.filter((day) => day.hasWorkout).length;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Cette semaine</ThemedText>
        {workoutCount > 0 && (
          <View style={styles.count}>
            <Flame size={16} color={palette.accent} strokeWidth={2} />
            <ThemedText type="caption" tone="accent" style={styles.countText}>
              {workoutCount} {workoutCount > 1 ? 'séances' : 'séance'}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.days}>
        {days.map((day, index) => (
          <View
            key={day.date.toISOString()}
            style={styles.day}
            accessible
            accessibilityLabel={`${day.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}${
              day.hasWorkout ? ', séance faite' : ''
            }${day.isToday ? ", aujourd'hui" : ''}`}>
            <ThemedText type="caption">{DAY_LETTERS[index]}</ThemedText>
            <View style={[styles.circle, day.hasWorkout && styles.circleDone, day.isToday && styles.circleToday]}>
              <ThemedText
                style={styles.dayNumber}
                tone={day.hasWorkout ? 'onAccent' : day.isToday ? 'primary' : 'secondary'}>
                {day.date.getDate()}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countText: {
    fontFamily: fontFamily.semibold,
  },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceRaised,
  },
  circleDone: {
    backgroundColor: palette.accent,
  },
  circleToday: {
    borderWidth: 2,
    borderColor: palette.accent,
  },
  dayNumber: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 17,
    lineHeight: 20,
  },
});
