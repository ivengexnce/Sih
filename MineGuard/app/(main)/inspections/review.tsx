import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useInspection, validateInspection } from '@/context/InspectionContext';
import { Image } from 'expo-image';

const STEPS = [
  { step: 1, label: 'Setup' },
  { step: 2, label: 'Observation' },
  { step: 3, label: 'Evidence' },
  { step: 4, label: 'Location' },
  { step: 5, label: 'Review', current: true },
];

// Map severity to badge color
const SEVERITY_COLORS: Record<string, string> = {
  Low: '#16A34A',
  Medium: '#D97706',
  High: '#DC2626',
  Critical: '#9333EA',
};

export default function ReviewInspectionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  // All data from shared context — zero hardcoded values
  const { draft, submitDraft } = useInspection();
  const { setup, observation, evidence, location, timestamp } = draft;

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const cardBg = isDark ? '#1E2328' : '#F8FAFC';
  const cardBorder = isDark ? '#2D3748' : '#E2E8F0';

  const validation = validateInspection(draft);

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (!validation.isValid) {
      return;
    }

    const succeeded = submitDraft();
    if (succeeded) {
      router.push('/(main)/inspections/submitted');
    }
  };

  const severityColor = SEVERITY_COLORS[observation.severity] ?? '#DC2626';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header with Back Button */}
          <View style={styles.headerRow}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={22}
                color={isDark ? '#ECEDEE' : '#11181C'}
              />
            </Pressable>
            <View style={styles.headerTextGroup}>
              <ThemedText type="title" style={styles.title}>
                Review Inspection
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Verify details before recording inspection
              </ThemedText>
            </View>
          </View>

          {/* Stepper Indicator */}
          <View
            style={[
              styles.stepperContainer,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}>
            {STEPS.map((s, idx) => (
              <View key={s.step} style={styles.stepperItem}>
                <View
                  style={[
                    styles.stepperDot,
                    s.current
                      ? styles.stepperDotActive
                      : styles.stepperDotCompleted,
                  ]}>
                  <ThemedText style={[styles.stepperDotText, { color: '#FFFFFF' }]}>
                    {s.step}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[
                    styles.stepperLabel,
                    s.current
                      ? [
                          styles.stepperLabelActive,
                          { color: isDark ? '#38BDF8' : '#0284C7' },
                        ]
                      : undefined,
                  ]}>
                  {s.label}
                </ThemedText>
                {idx < STEPS.length - 1 && <View style={styles.stepperLine} />}
              </View>
            ))}
          </View>

          {/* 1. Inspection Details Summary */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTitleGroup}>
                <Ionicons
                  name="business-outline"
                  size={18}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText style={styles.sectionHeading}>
                  Inspection Details
                </ThemedText>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => router.push('/(main)/inspections/start')}>
                <Ionicons
                  name="create-outline"
                  size={14}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText
                  style={[
                    styles.editButtonText,
                    { color: isDark ? '#38BDF8' : '#0284C7' },
                  ]}>
                  Edit Setup
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.gridItem}>
                <ThemedText style={styles.fieldLabel}>Mine</ThemedText>
                <ThemedText style={styles.fieldValue}>{setup.mine}</ThemedText>
              </View>
              <View style={styles.gridItem}>
                <ThemedText style={styles.fieldLabel}>Area</ThemedText>
                <ThemedText style={styles.fieldValue}>{setup.area}</ThemedText>
              </View>
              <View style={styles.gridItem}>
                <ThemedText style={styles.fieldLabel}>Level</ThemedText>
                <ThemedText style={styles.fieldValue}>{setup.level}</ThemedText>
              </View>
              <View style={styles.gridItem}>
                <ThemedText style={styles.fieldLabel}>Panel</ThemedText>
                <ThemedText style={styles.fieldValue}>{setup.panel}</ThemedText>
              </View>
              <View style={styles.gridItem}>
                <ThemedText style={styles.fieldLabel}>Type</ThemedText>
                <ThemedText style={styles.fieldValue}>{setup.inspectionType}</ThemedText>
              </View>
            </View>
          </View>

          {/* 2. Observation Section */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTitleGroup}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText style={styles.sectionHeading}>Observation</ThemedText>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => router.push('/(main)/inspections/form')}>
                <Ionicons
                  name="create-outline"
                  size={14}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText
                  style={[
                    styles.editButtonText,
                    { color: isDark ? '#38BDF8' : '#0284C7' },
                  ]}>
                  Edit Observation
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.observationContent}>
              <View style={styles.obsCategoryRow}>
                <ThemedText style={styles.obsCategoryLabel}>
                  Category:
                </ThemedText>
                <ThemedText style={styles.obsCategoryValue}>
                  {observation.category}
                </ThemedText>
                <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                  <ThemedText style={styles.severityBadgeText}>
                    {observation.severity.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.obsTextBox}>
                <ThemedText style={styles.obsText}>
                  {observation.description.trim() || 'No description entered.'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* 3. Evidence Section */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTitleGroup}>
                <Ionicons
                  name="images-outline"
                  size={18}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText style={styles.sectionHeading}>Evidence</ThemedText>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => router.push('/(main)/inspections/evidence')}>
                <Ionicons
                  name="create-outline"
                  size={14}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText
                  style={[
                    styles.editButtonText,
                    { color: isDark ? '#38BDF8' : '#0284C7' },
                  ]}>
                  Edit Evidence
                </ThemedText>
              </Pressable>
            </View>

            {evidence.length === 0 ? (
              <ThemedText style={styles.emptyText}>No evidence captured</ThemedText>
            ) : (
              <View style={styles.evidenceContent}>
                {evidence[0]?.uri ? (
                  <Image
                    source={{ uri: evidence[0].uri }}
                    style={styles.evidenceThumbImage}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.evidenceThumb}>
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color={isDark ? '#38BDF8' : '#0284C7'}
                    />
                  </View>
                )}
                <View style={styles.evidenceDetails}>
                  <ThemedText style={styles.evidenceTitle}>
                    {evidence.length} Evidence Photo{evidence.length > 1 ? 's' : ''} Attached
                  </ThemedText>
                  <ThemedText style={styles.evidenceSubtitle}>
                    {evidence[0]?.label || 'Visual field records captured'}
                  </ThemedText>
                </View>
              </View>
            )}
          </View>

          {/* 4. Location Section */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.headerTitleGroup}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText style={styles.sectionHeading}>Location</ThemedText>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => router.push('/(main)/inspections/location')}>
                <Ionicons
                  name="create-outline"
                  size={14}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText
                  style={[
                    styles.editButtonText,
                    { color: isDark ? '#38BDF8' : '#0284C7' },
                  ]}>
                  Edit Location
                </ThemedText>
              </Pressable>
            </View>

            {location === null ? (
              <ThemedText style={styles.emptyText}>Location not captured yet</ThemedText>
            ) : (
              <View style={styles.summaryList}>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryRowLabel}>Source Mode:</ThemedText>
                  <ThemedText style={styles.summaryRowValue}>{location.source}</ThemedText>
                </View>

                {/* GPS Coordinates (if captured) */}
                {(location.latitude || location.longitude) ? (
                  <>
                    <View style={styles.summaryRow}>
                      <ThemedText style={styles.summaryRowLabel}>GPS Coordinates:</ThemedText>
                      <ThemedText style={[styles.summaryRowValue, { color: isDark ? '#38BDF8' : '#0284C7', fontWeight: '700' }]}>
                        {location.latitude}, {location.longitude}
                      </ThemedText>
                    </View>
                    {location.accuracy ? (
                      <View style={styles.summaryRow}>
                        <ThemedText style={styles.summaryRowLabel}>Signal Accuracy:</ThemedText>
                        <ThemedText style={styles.summaryRowValue}>{location.accuracy}</ThemedText>
                      </View>
                    ) : null}
                  </>
                ) : null}

                {/* Statutory Mine Map Fields */}
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryRowLabel}>Mine Zone / Area:</ThemedText>
                  <ThemedText style={styles.summaryRowValue}>{location.zone}</ThemedText>
                </View>

                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryRowLabel}>Seam Level:</ThemedText>
                  <ThemedText style={styles.summaryRowValue}>{location.level}</ThemedText>
                </View>

                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryRowLabel}>Panel ID:</ThemedText>
                  <ThemedText style={styles.summaryRowValue}>{location.panel}</ThemedText>
                </View>

                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryRowLabel}>Spatial Confidence:</ThemedText>
                  <ThemedText style={styles.summaryRowValue}>{location.confidence}</ThemedText>
                </View>

                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryRowLabel}>Sync State:</ThemedText>
                  <ThemedText
                    style={[
                      styles.summaryRowValue,
                      { color: location.isOffline ? '#D97706' : '#059669', fontWeight: '700' },
                    ]}>
                    {location.isOffline ? 'Offline (Queued for Sync)' : 'Online (Live Sync)'}
                  </ThemedText>
                </View>
              </View>
            )}
          </View>

          {/* 5. Inspection Timestamp */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <ThemedText style={styles.sectionHeading}>Inspection Time</ThemedText>
            <View style={styles.timestampRow}>
              <Ionicons
                name="time-outline"
                size={18}
                color={isDark ? '#38BDF8' : '#0284C7'}
              />
              <ThemedText style={styles.timestampText}>{timestamp}</ThemedText>
            </View>
          </View>

          {/* Validation Error Banner */}
          {hasAttemptedSubmit && !validation.isValid ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <View style={styles.errorTextContainer}>
                <ThemedText style={styles.errorBannerTitle}>
                  Incomplete Inspection Requirements:
                </ThemedText>
                {validation.errors.setup ? (
                  <ThemedText style={styles.errorBannerItem}>
                    • {validation.errors.setup}
                  </ThemedText>
                ) : null}
                {validation.errors.observation ? (
                  <ThemedText style={styles.errorBannerItem}>
                    • {validation.errors.observation}
                  </ThemedText>
                ) : null}
                {validation.errors.evidence ? (
                  <ThemedText style={styles.errorBannerItem}>
                    • {validation.errors.evidence}
                  </ThemedText>
                ) : null}
                {validation.errors.location ? (
                  <ThemedText style={styles.errorBannerItem}>
                    • {validation.errors.location}
                  </ThemedText>
                ) : null}
              </View>
            </View>
          ) : null}

          {/* Primary Submit Button */}
          <View style={styles.actionContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleSubmit}>
              <Ionicons name="checkmark-done" size={22} color="#FFFFFF" />
              <ThemedText
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
                style={styles.submitButtonText}>
                Submit Inspection
              </ThemedText>
            </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepperDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDotActive: {
    backgroundColor: '#0284C7',
  },
  stepperDotCompleted: {
    backgroundColor: '#16A34A',
  },
  stepperDotText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepperLabel: {
    fontSize: 11,
    opacity: 0.6,
  },
  stepperLabelActive: {
    fontWeight: '700',
    opacity: 1,
  },
  stepperLine: {
    width: 8,
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    marginLeft: 4,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 4,
  },
  gridItem: {
    minWidth: '28%',
    gap: 2,
  },
  fieldLabel: {
    fontSize: 11,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  observationContent: {
    gap: 8,
  },
  obsCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  obsCategoryLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  obsCategoryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  severityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  obsTextBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
  },
  obsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  evidenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.06)',
  },
  evidenceThumbImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  evidenceThumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceDetails: {
    flex: 1,
    gap: 2,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  evidenceSubtitle: {
    fontSize: 12,
    opacity: 0.65,
  },
  summaryList: {
    gap: 6,
    paddingTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryRowLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  summaryRowValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  timestampText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorTextContainer: {
    flex: 1,
    gap: 3,
  },
  errorBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },
  errorBannerItem: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
    lineHeight: 16,
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  submitButton: {
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
