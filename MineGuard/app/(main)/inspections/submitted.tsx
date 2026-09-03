import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useInspection } from '@/context/InspectionContext';

export default function InspectionSubmittedScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const { completedInspections } = useInspection();
  const lastSubmitted = completedInspections[0];
  const submittedId = lastSubmitted?.inspectionId ?? '—';
  const isSynced = lastSubmitted?.status === 'Synced';

  const cardBg = isDark ? '#1E2328' : '#F8FAFC';
  const cardBorder = isDark ? '#2D3748' : '#E2E8F0';

  const handleBackToHome = () => {
    router.replace('/(main)/home');
  };

  const handleViewInspections = () => {
    router.replace('/(main)/inspections');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Main Success Card */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {/* Big Success Icon */}
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-circle" size={56} color="#16A34A" />
            </View>

            <ThemedText type="title" style={styles.title}>
              Inspection Submitted
            </ThemedText>

            {/* Inspection ID Badge */}
            <View style={styles.idContainer}>
              <ThemedText style={styles.idLabel}>Inspection ID</ThemedText>
              <ThemedText style={styles.idValue}>{submittedId}</ThemedText>
            </View>

            <ThemedText style={styles.message}>
              Your inspection has been recorded successfully.
            </ThemedText>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Dynamic Sync Status Section */}
            <View
              style={[
                styles.syncBox,
                {
                  backgroundColor: isSynced ? 'rgba(22, 163, 74, 0.08)' : 'rgba(217, 119, 6, 0.08)',
                  borderColor: isSynced ? 'rgba(22, 163, 74, 0.25)' : 'rgba(217, 119, 6, 0.25)',
                },
              ]}>
              <View style={styles.syncStatusRow}>
                <Ionicons
                  name={isSynced ? 'cloud-done' : 'time-outline'}
                  size={18}
                  color={isSynced ? '#16A34A' : '#D97706'}
                />
                <ThemedText
                  style={[
                    styles.syncStatusText,
                    { color: isSynced ? '#16A34A' : '#D97706' },
                  ]}>
                  {isSynced ? 'Synced to Cloud' : 'Pending Sync'}
                </ThemedText>
              </View>
              <ThemedText style={styles.syncDescription}>
                {isSynced
                  ? 'Your inspection report has been uploaded and synchronized with Cloud Firestore.'
                  : 'The inspection is saved locally and will be synchronized when connectivity is available.'}
              </ThemedText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Back to Home Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleBackToHome}>
              <Ionicons name="home-outline" size={20} color="#FFFFFF" />
              <ThemedText
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
                style={styles.primaryButtonText}>
                Back to Home
              </ThemedText>
            </Pressable>

            {/* View Inspections Button */}
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: isDark ? '#38BDF8' : '#0284C7',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleViewInspections}>
              <Ionicons
                name="clipboard-outline"
                size={20}
                color={isDark ? '#38BDF8' : '#0284C7'}
              />
              <ThemedText
                style={[
                  styles.secondaryButtonText,
                  { color: isDark ? '#38BDF8' : '#0284C7' },
                ]}>
                View Inspections
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  idContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 2,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  idValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    opacity: 0.75,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 2,
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(150, 150, 150, 0.25)',
    marginVertical: 4,
  },
  syncBox: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.2)',
    gap: 6,
    alignItems: 'center',
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncStatusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  syncDescription: {
    fontSize: 12,
    opacity: 0.75,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 380,
    gap: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
