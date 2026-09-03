import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ObservationCategory, SeverityLevel, useInspection, validateObservation } from '@/context/InspectionContext';

const CATEGORIES: ObservationCategory[] = [
  'Worker Safety',
  'PPE Compliance',
  'Equipment',
  'Ventilation',
  'Fire Safety',
  'Environment',
  'Labour',
  'Other',
];

const SEVERITIES: SeverityLevel[] = ['Low', 'Medium', 'High', 'Critical'];

const STEPS = [
  { step: 1, label: 'Setup' },
  { step: 2, label: 'Observation', current: true },
  { step: 3, label: 'Evidence' },
  { step: 4, label: 'Location' },
  { step: 5, label: 'Review' },
];

export default function InspectionFormScreen() {
  const router = useRouter();
  const { draft, updateObservation } = useInspection();

  const { setup, observation, evidence, location, timestamp } = draft;
  const evidenceCountNum = evidence.length;
  const isLocationSaved = location !== null;

  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cardBg = isDark ? '#1E2328' : '#F8FAFC';
  const cardBorder = isDark ? '#2D3748' : '#E2E8F0';
  const inputBg = isDark ? '#151718' : '#FFFFFF';
  const inputBorder = isDark ? '#333D47' : '#D0D7DE';
  const textColor = isDark ? '#ECEDEE' : '#11181C';

  const getSeverityStyle = (level: SeverityLevel, isSelected: boolean) => {
    switch (level) {
      case 'Low':
        return {
          bg: isSelected ? (isDark ? '#064E3B' : '#DCFCE7') : inputBg,
          border: isSelected ? '#16A34A' : inputBorder,
          text: isSelected ? (isDark ? '#4ADE80' : '#15803D') : textColor,
        };
      case 'Medium':
        return {
          bg: isSelected ? (isDark ? '#78350F' : '#FEF3C7') : inputBg,
          border: isSelected ? '#D97706' : inputBorder,
          text: isSelected ? (isDark ? '#FBBF24' : '#B45309') : textColor,
        };
      case 'High':
        return {
          bg: isSelected ? (isDark ? '#7F1D1D' : '#FEE2E2') : inputBg,
          border: isSelected ? '#DC2626' : inputBorder,
          text: isSelected ? (isDark ? '#F87171' : '#B91C1C') : textColor,
        };
      case 'Critical':
        return {
          bg: isSelected ? (isDark ? '#581C87' : '#F3E8FF') : inputBg,
          border: isSelected ? '#9333EA' : inputBorder,
          text: isSelected ? (isDark ? '#C084FC' : '#7E22CE') : textColor,
        };
    }
  };

  const handleContinueToReview = () => {
    const obsValidation = validateObservation(draft.observation);
    if (!obsValidation.isValid) {
      setErrorMessage(obsValidation.error ?? 'Please complete observation details.');
      return;
    }

    setErrorMessage(null);
    router.push('/(main)/inspections/review');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
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
                  Inspection Form
                </ThemedText>
                <ThemedText style={styles.stepBadge}>
                  Step 2 of 5 — Observation
                </ThemedText>
              </View>
            </View>

            {/* Stepper Indicator */}
            <View style={[styles.stepperContainer, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              {STEPS.map((s, idx) => (
                <View key={s.step} style={styles.stepperItem}>
                  <View
                    style={[
                      styles.stepperDot,
                      s.current
                        ? styles.stepperDotActive
                        : s.step < 2
                        ? styles.stepperDotCompleted
                        : styles.stepperDotUpcoming,
                    ]}>
                    <ThemedText
                      style={[
                        styles.stepperDotText,
                        s.current || s.step < 2
                          ? { color: '#FFFFFF' }
                          : { color: isDark ? '#94A3B8' : '#64748B' },
                      ]}>
                      {s.step}
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={[
                      styles.stepperLabel,
                      s.current
                        ? [styles.stepperLabelActive, { color: isDark ? '#38BDF8' : '#0284C7' }]
                        : undefined,
                    ]}>
                    {s.label}
                  </ThemedText>
                  {idx < STEPS.length - 1 && <View style={styles.stepperLine} />}
                </View>
              ))}
            </View>

            {/* Inspection Summary Card — reads from shared draft.setup */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.summaryHeader}>
                <Ionicons name="information-circle-outline" size={18} color={isDark ? '#38BDF8' : '#0284C7'} />
                <ThemedText style={styles.sectionHeading}>Inspection Scope Summary</ThemedText>
              </View>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryLabel}>Mine</ThemedText>
                  <ThemedText style={styles.summaryValue}>{setup.mine}</ThemedText>
                </View>
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryLabel}>Area</ThemedText>
                  <ThemedText style={styles.summaryValue}>{setup.area}</ThemedText>
                </View>
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryLabel}>Level</ThemedText>
                  <ThemedText style={styles.summaryValue}>{setup.level}</ThemedText>
                </View>
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryLabel}>Panel</ThemedText>
                  <ThemedText style={styles.summaryValue}>{setup.panel}</ThemedText>
                </View>
                <View style={styles.summaryItem}>
                  <ThemedText style={styles.summaryLabel}>Type</ThemedText>
                  <ThemedText style={styles.summaryValue}>{setup.inspectionType}</ThemedText>
                </View>
              </View>
            </View>

            {/* Observation Category Selector */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <ThemedText style={styles.sectionHeading}>Observation Category *</ThemedText>
              <View style={styles.chipsContainer}>
                {CATEGORIES.map((cat) => {
                  const isSelected = observation.category === cat;
                  return (
                    <Pressable
                      key={cat}
                      style={({ pressed }) => [
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? '#0284C7'
                              : '#0369A1'
                            : inputBg,
                          borderColor: isSelected
                            ? isDark
                              ? '#38BDF8'
                              : '#0284C7'
                            : inputBorder,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                      onPress={() => {
                        updateObservation({ category: cat });
                        if (errorMessage) setErrorMessage(null);
                      }}>
                      <ThemedText
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#FFFFFF' : textColor,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}>
                        {cat}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Observation Description */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <ThemedText style={styles.sectionHeading}>Observation Description *</ThemedText>
              <TextInput
                style={[
                  styles.multilineInput,
                  {
                    backgroundColor: inputBg,
                    borderColor: inputBorder,
                    color: textColor,
                  },
                ]}
                value={observation.description}
                onChangeText={(text) => {
                  updateObservation({ description: text });
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Describe what you observed in the field... (e.g. Worker observed without helmet near excavation area)"
                placeholderTextColor={isDark ? '#808B96' : '#8C959F'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Severity Selector */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <ThemedText style={styles.sectionHeading}>Severity Level *</ThemedText>
              <View style={styles.severityGrid}>
                {SEVERITIES.map((lvl) => {
                  const isSelected = observation.severity === lvl;
                  const lvlStyle = getSeverityStyle(lvl, isSelected);
                  return (
                    <Pressable
                      key={lvl}
                      style={({ pressed }) => [
                        styles.severityCard,
                        {
                          backgroundColor: lvlStyle.bg,
                          borderColor: lvlStyle.border,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                      onPress={() => {
                        updateObservation({ severity: lvl });
                        if (errorMessage) setErrorMessage(null);
                      }}>
                      <ThemedText
                        style={[
                          styles.severityCardText,
                          {
                            color: lvlStyle.text,
                            fontWeight: isSelected ? '700' : '600',
                          },
                        ]}>
                        {lvl}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Evidence Section */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.sectionRowBetween}>
                <ThemedText style={styles.sectionHeading}>Evidence</ThemedText>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    {
                      borderColor: isDark ? '#38BDF8' : '#0284C7',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => router.push('/(main)/inspections/evidence')}>
                  <Ionicons
                    name={evidenceCountNum > 0 ? 'create-outline' : 'camera-outline'}
                    size={16}
                    color={isDark ? '#38BDF8' : '#0284C7'}
                  />
                  <ThemedText
                    style={[styles.secondaryButtonText, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                    {evidenceCountNum > 0 ? 'Edit Evidence' : '+ Add Evidence'}
                  </ThemedText>
                </Pressable>
              </View>
              <View
                style={[
                  styles.statusBox,
                  evidenceCountNum > 0
                    ? { backgroundColor: isDark ? 'rgba(5, 150, 105, 0.12)' : '#DCFCE7' }
                    : undefined,
                ]}>
                <Ionicons
                  name={evidenceCountNum > 0 ? 'checkmark-circle' : 'images-outline'}
                  size={18}
                  color={evidenceCountNum > 0 ? '#16A34A' : isDark ? '#94A3B8' : '#64748B'}
                />
                <ThemedText
                  style={[
                    styles.statusBoxText,
                    evidenceCountNum > 0 ? { color: isDark ? '#4ADE80' : '#15803D', fontWeight: '600' } : undefined,
                  ]}>
                  {evidenceCountNum > 0
                    ? `${evidenceCountNum} Evidence Photo${evidenceCountNum > 1 ? 's' : ''} Attached`
                    : 'No evidence captured'}
                </ThemedText>
              </View>
            </View>

            {/* Location Section */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.sectionRowBetween}>
                <ThemedText style={styles.sectionHeading}>Location Coordinates</ThemedText>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    {
                      borderColor: isDark ? '#38BDF8' : '#0284C7',
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => router.push('/(main)/inspections/location')}>
                  <Ionicons
                    name={isLocationSaved ? 'create-outline' : 'location-outline'}
                    size={16}
                    color={isDark ? '#38BDF8' : '#0284C7'}
                  />
                  <ThemedText
                    style={[styles.secondaryButtonText, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                    {isLocationSaved ? 'Edit Location' : 'Set Location'}
                  </ThemedText>
                </Pressable>
              </View>
              <View
                style={[
                  styles.statusBox,
                  isLocationSaved
                    ? { backgroundColor: isDark ? 'rgba(5, 150, 105, 0.12)' : '#DCFCE7' }
                    : undefined,
                ]}>
                <Ionicons
                  name={isLocationSaved ? 'checkmark-circle' : 'navigate-outline'}
                  size={18}
                  color={isLocationSaved ? '#16A34A' : isDark ? '#94A3B8' : '#64748B'}
                />
                <View style={styles.locationSavedInfo}>
                  <ThemedText
                    style={[
                      styles.statusBoxText,
                      isLocationSaved ? { color: isDark ? '#4ADE80' : '#15803D', fontWeight: '700' } : undefined,
                    ]}>
                    {isLocationSaved
                      ? `${location!.source} — ${location!.zone}`
                      : 'Location not captured yet'}
                  </ThemedText>
                  {isLocationSaved && location ? (
                    <>
                      {(location.latitude || location.longitude) ? (
                        <ThemedText style={[styles.locationSavedSubtext, { color: isDark ? '#38BDF8' : '#0284C7', fontWeight: '600' }]}>
                          GPS: {location.latitude}, {location.longitude} ({location.accuracy || '±3m'})
                        </ThemedText>
                      ) : null}
                      <ThemedText style={styles.locationSavedSubtext}>
                        Level {location.level} • Panel {location.panel} • {location.confidence} confidence
                      </ThemedText>
                    </>
                  ) : null}
                </View>
              </View>
            </View>

            {/* Timestamp Section */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <ThemedText style={styles.sectionHeading}>Inspection Time</ThemedText>
              <View style={styles.timestampRow}>
                <Ionicons name="time-outline" size={18} color={isDark ? '#38BDF8' : '#0284C7'} />
                <ThemedText style={styles.timestampText}>{timestamp}</ThemedText>
              </View>
            </View>

            {/* Validation Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <ThemedText style={styles.errorBannerText}>{errorMessage}</ThemedText>
              </View>
            ) : null}

            {/* Continue Action Button */}
            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleContinueToReview}>
              <ThemedText
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
                style={styles.continueButtonText}>
                Continue to Review
              </ThemedText>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
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
  stepBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
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
  stepperDotUpcoming: {
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
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
    gap: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 4,
  },
  summaryItem: {
    minWidth: '28%',
    gap: 2,
  },
  summaryLabel: {
    fontSize: 11,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  multilineInput: {
    minHeight: 110,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  severityGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  severityCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityCardText: {
    fontSize: 13,
  },
  sectionRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
  },
  statusBoxText: {
    fontSize: 13,
    opacity: 0.75,
  },
  locationSavedInfo: {
    flex: 1,
    gap: 2,
  },
  locationSavedSubtext: {
    fontSize: 11,
    opacity: 0.75,
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
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },
  continueButton: {
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    marginBottom: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
