import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CompletedInspection, SeverityLevel, useInspection } from '@/context/InspectionContext';

// Map the context SeverityLevel to the display format used on the cards
function toDisplaySeverity(severity: SeverityLevel): 'HIGH' | 'MEDIUM' | 'LOW' {
  switch (severity) {
    case 'High':
    case 'Critical':
      return 'HIGH';
    case 'Medium':
      return 'MEDIUM';
    case 'Low':
      return 'LOW';
  }
}

export default function InspectionsListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  // Single source of truth: seed mocks + newly submitted inspections
  const { completedInspections, resetDraft } = useInspection();

  const cardBg = isDark ? '#1E2328' : '#F8FAFC';
  const cardBorder = isDark ? '#2D3748' : '#E2E8F0';

  const getSeverityColors = (displaySeverity: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (displaySeverity) {
      case 'HIGH':
        return { bg: isDark ? '#451A1A' : '#FEE2E2', text: isDark ? '#F87171' : '#DC2626' };
      case 'MEDIUM':
        return { bg: isDark ? '#422006' : '#FEF3C7', text: isDark ? '#FBBF24' : '#D97706' };
      case 'LOW':
        return { bg: isDark ? '#052E16' : '#DCFCE7', text: isDark ? '#4ADE80' : '#16A34A' };
    }
  };

  const handleStartNewInspection = () => {
    resetDraft();
    router.push('/(main)/inspections/start');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Inspections
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Field inspection records
            </ThemedText>
          </View>

          {/* Start New Inspection Action Button */}
          <Pressable
            style={({ pressed }) => [
              styles.startNewButton,
              {
                backgroundColor: isDark ? '#0284C7' : '#0369A1',
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={handleStartNewInspection}>
            <Ionicons name="add-circle" size={22} color="#FFFFFF" />
            <ThemedText
              lightColor="#FFFFFF"
              darkColor="#FFFFFF"
              style={styles.startNewButtonText}>
              + Start New Inspection
            </ThemedText>
          </Pressable>

          {/* Cards List — reads from shared completedInspections[] */}
          <View style={styles.listContainer}>
            {completedInspections.map((item: CompletedInspection) => {
              const displaySeverity = toDisplaySeverity(item.observation.severity);
              const severityColors = getSeverityColors(displaySeverity);
              const isPending = item.status === 'Pending Sync';

              // Location label: prefer saved location zone, fall back to setup area
              const locationLabel = item.location?.zone ?? item.setup.area;

              return (
                <View
                  key={item.inspectionId}
                  style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  {/* Top Row: ID + Severity Badge */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.idGroup}>
                      <Ionicons
                        name="clipboard-outline"
                        size={18}
                        color={isDark ? '#38BDF8' : '#0284C7'}
                      />
                      <ThemedText style={styles.inspectionId}>{item.inspectionId}</ThemedText>
                    </View>

                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: severityColors.bg },
                      ]}>
                      <ThemedText
                        style={[
                          styles.severityText,
                          { color: severityColors.text },
                        ]}>
                        {displaySeverity}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Category (observation category used as the card title) */}
                  <ThemedText style={styles.categoryTitle}>
                    {item.observation.category}
                  </ThemedText>

                  {/* Location Info */}
                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={isDark ? '#94A3B8' : '#64748B'}
                    />
                    <ThemedText style={styles.locationText}>{locationLabel}</ThemedText>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Bottom Row: Sync Status */}
                  <View style={styles.cardFooterRow}>
                    <View style={styles.statusGroup}>
                      <Ionicons
                        name={isPending ? 'time-outline' : 'checkmark-circle-outline'}
                        size={16}
                        color={isPending ? '#D97706' : '#16A34A'}
                      />
                      <ThemedText
                        style={[
                          styles.statusLabel,
                          { color: isPending ? '#D97706' : '#16A34A' },
                        ]}>
                        {item.status}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    marginTop: 2,
  },
  startNewButton: {
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
  startNewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContainer: {
    gap: 14,
    marginTop: 4,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inspectionId: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    opacity: 0.75,
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    marginVertical: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
