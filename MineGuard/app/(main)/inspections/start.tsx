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
import { InspectionType, useInspection, validateSetup } from '@/context/InspectionContext';

const INSPECTION_TYPES: InspectionType[] = [
  'Safety',
  'Environment',
  'Equipment',
  'Labour',
  'General',
];

export default function StartInspectionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const { draft, updateSetup } = useInspection();
  const { mine, area, level, panel, inspectionType } = draft.setup;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cardBg = isDark ? '#1E2328' : '#F8FAFC';
  const cardBorder = isDark ? '#2D3748' : '#E2E8F0';
  const inputBg = isDark ? '#151718' : '#FFFFFF';
  const inputBorder = isDark ? '#333D47' : '#D0D7DE';
  const textColor = isDark ? '#ECEDEE' : '#11181C';

  const handleContinue = () => {
    const validation = validateSetup(draft.setup);
    if (!validation.isValid) {
      setErrorMessage(validation.error ?? 'Please fill all required setup fields.');
      return;
    }
    setErrorMessage(null);
    router.push('/(main)/inspections/form');
  };

  const handleBack = () => {
    router.back();
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
                onPress={handleBack}>
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={isDark ? '#ECEDEE' : '#11181C'}
                />
              </Pressable>
              <View style={styles.headerTextGroup}>
                <ThemedText type="title" style={styles.title}>
                  Start Inspection
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Configure location & inspection scope
                </ThemedText>
              </View>
            </View>

            {/* Mine Card (Read-only / Assigned) */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <ThemedText style={styles.sectionHeading}>Mine Site</ThemedText>
              <View style={styles.mineRow}>
                <Ionicons
                  name="business"
                  size={20}
                  color={isDark ? '#38BDF8' : '#0284C7'}
                />
                <ThemedText style={styles.mineValue}>{mine}</ThemedText>
                <View style={styles.assignedBadge}>
                  <ThemedText style={styles.assignedBadgeText}>ASSIGNED</ThemedText>
                </View>
              </View>
            </View>

            {/* Location Parameters Form */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <ThemedText style={styles.sectionHeading}>Location Parameters</ThemedText>

              {/* Area / Zone */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Area / Zone *</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBg,
                      borderColor: inputBorder,
                      color: textColor,
                    },
                  ]}
                  value={area}
                  onChangeText={(text) => {
                    updateSetup({ area: text });
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="e.g. Underground Section B"
                  placeholderTextColor={isDark ? '#808B96' : '#8C959F'}
                />
              </View>

              {/* Level & Panel Row */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.flexInput]}>
                  <ThemedText style={styles.label}>Level *</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBg,
                        borderColor: inputBorder,
                        color: textColor,
                      },
                    ]}
                    value={level}
                    onChangeText={(text) => {
                      updateSetup({ level: text });
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. -250m"
                    placeholderTextColor={isDark ? '#808B96' : '#8C959F'}
                  />
                </View>

                <View style={[styles.inputGroup, styles.flexInput]}>
                  <ThemedText style={styles.label}>Panel *</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBg,
                        borderColor: inputBorder,
                        color: textColor,
                      },
                    ]}
                    value={panel}
                    onChangeText={(text) => {
                      updateSetup({ panel: text });
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. B-12"
                    placeholderTextColor={isDark ? '#808B96' : '#8C959F'}
                  />
                </View>
              </View>
            </View>

            {/* Inspection Type Selector */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <ThemedText style={styles.sectionHeading}>Inspection Type</ThemedText>
              <ThemedText style={styles.fieldDescription}>
                Select the primary compliance category:
              </ThemedText>

              <View style={styles.typeChipsContainer}>
                {INSPECTION_TYPES.map((type) => {
                  const isSelected = inspectionType === type;
                  return (
                    <Pressable
                      key={type}
                      style={({ pressed }) => [
                        styles.chip,
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
                        updateSetup({ inspectionType: type });
                        if (errorMessage) setErrorMessage(null);
                      }}>
                      <ThemedText
                        style={[
                          styles.chipText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : isDark
                              ? '#ECEDEE'
                              : '#11181C',
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}>
                        {type}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Validation Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <ThemedText style={styles.errorBannerText}>{errorMessage}</ThemedText>
              </View>
            ) : null}

            {/* Continue Button */}
            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleContinue}>
              <ThemedText
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
                style={styles.continueButtonText}>
                Continue
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
    marginBottom: 4,
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
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  fieldDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  mineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mineValue: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  assignedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#059669',
  },
  assignedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.85,
  },
  input: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flexInput: {
    flex: 1,
  },
  typeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
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
