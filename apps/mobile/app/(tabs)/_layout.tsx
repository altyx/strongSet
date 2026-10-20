import { Tabs } from 'expo-router';
import { Dumbbell, House } from 'lucide-react-native/icons';
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
          tabBarIcon: ({ color }) => <House size={24} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercices',
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
