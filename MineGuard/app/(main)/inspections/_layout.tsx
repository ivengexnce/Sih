import React from 'react';
import { Stack } from 'expo-router';

export default function InspectionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="start" />
      <Stack.Screen name="form" />
      <Stack.Screen name="evidence" />
      <Stack.Screen name="location" />
      <Stack.Screen name="review" />
      <Stack.Screen name="submitted" />
    </Stack>
  );
}
