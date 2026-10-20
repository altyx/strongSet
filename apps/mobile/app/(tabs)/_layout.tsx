import { Tabs } from 'expo-router';
import { Dumbbell, House, TrendingUp } from 'lucide-react-native/icons';
import React from 'react';

import { HapticTab } from '@/src/components/haptic-tab';
import { fontFamily, palette } from '@/src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.surfaceRaised,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.semibold,
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          // pointerEvents none : sinon le SVG capte le toucher et l'onglet ne réagit pas quand on tape sur l'icône
          tabBarIcon: ({ color }) => <House size={24} color={color} strokeWidth={2} pointerEvents="none" />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercices',
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} strokeWidth={2} pointerEvents="none" />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progrès',
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} strokeWidth={2} pointerEvents="none" />,
        }}
      />
    </Tabs>
  );
}
