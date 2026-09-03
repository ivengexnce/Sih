import React, { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EvidenceItem, useInspection } from '@/context/InspectionContext';

const STEPS = [
  { step: 1, label: 'Setup' },
  { step: 2, label: 'Observation' },
  { step: 3, label: 'Evidence', current: true },
  { step: 4, label: 'Location' },
  { step: 5, label: 'Review' },
];

export default function EvidenceScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  // Context & Draft
  const { draft, addEvidence, removeEvidence } = useInspection();
  const { evidence: evidenceList, setup } = draft;

  // Camera State
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const cameraRef = useRef<any>(null);

  const cardBg = isDark ? '#1E2328' : '#F8FAFC';
  const cardBorder = isDark ? '#2D3748' : '#E2E8F0';
  const thumbBg = isDark ? '#151718' : '#EDF2F7';

  // 1. Open Camera Viewfinder
  const handleOpenCamera = async () => {
    setCameraError(null);

    if (!permission) {
      const res = await requestPermission();
      if (!res.granted) {
        setCameraError('Camera permission is required to capture field evidence.');
        return;
      }
    } else if (!permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setCameraError('Camera permission was denied. Please allow access in settings.');
        return;
      }
    }

    setIsCameraActive(true);
  };

  // 2. Take Live Photo
  const handleTakePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });

      if (photo?.uri) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newItem: EvidenceItem = {
          id: Date.now().toString(),
          label: `Field Photo (${facing.toUpperCase()})`,
          time: `${timeStr} (Live Camera)`,
          uri: photo.uri,
          type: 'camera',
        };

        addEvidence(newItem);
        setIsCameraActive(false);
      }
    } catch (err: any) {
      console.warn('Camera capture error:', err);
      setCameraError('Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // 3. Pick from Gallery / Device Storage
  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newItem: EvidenceItem = {
          id: Date.now().toString(),
          label: 'Gallery Field Photo',
          time: `${timeStr} (Uploaded)`,
          uri: result.assets[0].uri,
          type: 'upload',
        };

        addEvidence(newItem);
      }
    } catch (err) {
      console.warn('Gallery pick error:', err);
    }
  };

  // 4. Fallback Sample Photo
  const handleAddSampleEvidence = () => {
    const newItem: EvidenceItem = {
      id: Date.now().toString(),
      label: 'Sample Field Photo',
      time: 'Captured just now',
      type: 'sample',
    };
    addEvidence(newItem);
  };

  const handleSaveEvidence = () => {
    router.navigate('/(main)/inspections/form');
  };

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
              onPress={() => router.navigate('/(main)/inspections/form')}>
              <Ionicons
                name="arrow-back"
                size={22}
                color={isDark ? '#ECEDEE' : '#11181C'}
              />
            </Pressable>
            <View style={styles.headerTextGroup}>
              <ThemedText type="title" style={styles.title}>
                Evidence
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Capture visual field photos for this inspection
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
                      : s.step < 3
                      ? styles.stepperDotCompleted
                      : styles.stepperDotUpcoming,
                  ]}>
                  <ThemedText
                    style={[
                      styles.stepperDotText,
                      s.current || s.step < 3
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

          {/* Inspection Summary Card */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.summaryHeader}>
              <Ionicons name="information-circle-outline" size={18} color={isDark ? '#38BDF8' : '#0284C7'} />
              <ThemedText style={styles.sectionHeading}>Inspection Context</ThemedText>
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
                <ThemedText style={styles.summaryLabel}>Inspection</ThemedText>
                <ThemedText style={styles.summaryValue}>{setup.inspectionType}</ThemedText>
              </View>
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleOpenCamera}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
              <ThemedText style={styles.captureButtonText}>
                Live Camera
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.galleryButton,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderColor: isDark ? '#334155' : '#CBD5E1',
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={handlePickFromGallery}>
              <Ionicons name="images-outline" size={18} color={isDark ? '#38BDF8' : '#0284C7'} />
              <ThemedText style={[styles.galleryButtonText, { color: isDark ? '#ECEDEE' : '#0F172A' }]}>
                Pick Gallery
              </ThemedText>
            </Pressable>
          </View>

          {cameraError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#B91C1C" />
              <ThemedText style={styles.errorBannerText}>{cameraError}</ThemedText>
            </View>
          ) : null}

          {/* Evidence Counter & Subtitle */}
          <View style={styles.counterRow}>
            <View style={styles.countBadge}>
              <Ionicons name="images" size={18} color={isDark ? '#38BDF8' : '#0284C7'} />
              <ThemedText style={styles.countBadgeText}>
                Attached Evidence ({evidenceList.length})
              </ThemedText>
            </View>

            {evidenceList.length === 0 ? (
              <Pressable onPress={handleAddSampleEvidence} style={styles.sampleLink}>
                <ThemedText style={styles.sampleLinkText}>+ Add Sample</ThemedText>
              </Pressable>
            ) : null}
          </View>

          {/* Evidence List / Empty State */}
          {evidenceList.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="camera-outline"
                  size={44}
                  color={isDark ? '#94A3B8' : '#64748B'}
                />
              </View>
              <ThemedText style={styles.emptyTitle}>No photos captured yet</ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Tap Live Camera to take photos of safety risks or upload from gallery.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.evidenceList}>
              {evidenceList.map((item, index) => (
                <View
                  key={item.id}
                  style={[styles.evidenceCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  {/* Photo Thumbnail */}
                  {item.uri ? (
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.thumbImage}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <View style={[styles.thumbBox, { backgroundColor: thumbBg }]}>
                      <Ionicons
                        name="image-outline"
                        size={28}
                        color={isDark ? '#38BDF8' : '#0284C7'}
                      />
                    </View>
                  )}

                  {/* Evidence Details */}
                  <View style={styles.evidenceInfo}>
                    <View style={styles.evidenceHeaderRow}>
                      <ThemedText style={styles.evidenceNumber}>
                        Photo #{index + 1}
                      </ThemedText>
                      <View
                        style={[
                          styles.typeBadge,
                          {
                            backgroundColor:
                              item.type === 'camera'
                                ? '#059669'
                                : item.type === 'upload'
                                ? '#0284C7'
                                : '#D97706',
                          },
                        ]}>
                        <ThemedText style={styles.typeBadgeText}>
                          {(item.type || 'PHOTO').toUpperCase()}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.evidenceLabel}>{item.label}</ThemedText>
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={14} color={isDark ? '#94A3B8' : '#64748B'} />
                      <ThemedText style={styles.evidenceTime}>{item.time}</ThemedText>
                    </View>
                  </View>

                  {/* Delete Button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.removeButton,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => removeEvidence(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleSaveEvidence}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <ThemedText
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
                style={styles.continueButtonText}>
                Save & Return to Form
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Live Camera Viewfinder Modal */}
      <Modal
        visible={isCameraActive}
        animationType="slide"
        onRequestClose={() => setIsCameraActive(false)}>
        <View style={styles.cameraContainer}>
          <CameraView style={StyleSheet.absoluteFillObject} facing={facing} ref={cameraRef} />
          <SafeAreaView style={styles.cameraOverlay}>
            {/* Top Controls */}
            <View style={styles.cameraTopRow}>
              <Pressable
                style={styles.cameraCircleBtn}
                onPress={() => setIsCameraActive(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>

              <ThemedText style={styles.cameraTitleText}>
                Field Evidence Viewfinder
              </ThemedText>

              <Pressable
                style={styles.cameraCircleBtn}
                onPress={() =>
                  setFacing((prev) => (prev === 'back' ? 'front' : 'back'))
                }>
                <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Viewfinder Target Guidelines */}
            <View style={styles.targetFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* Bottom Shutter Controls */}
            <View style={styles.cameraBottomRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.shutterButtonOuter,
                  { opacity: pressed || isCapturing ? 0.7 : 1 },
                ]}
                onPress={handleTakePicture}
                disabled={isCapturing}>
                {isCapturing ? (
                  <ActivityIndicator color="#0284C7" size="large" />
                ) : (
                  <View style={styles.shutterButtonInner} />
                )}
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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
    gap: 10,
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
    gap: 16,
    paddingTop: 4,
  },
  summaryItem: {
    gap: 2,
    flex: 1,
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  captureButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  galleryButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  galleryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sampleLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sampleLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  evidenceList: {
    gap: 12,
  },
  evidenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  thumbImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  thumbBox: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceInfo: {
    flex: 1,
    gap: 2,
  },
  evidenceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evidenceNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  evidenceLabel: {
    fontSize: 13,
    opacity: 0.85,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  evidenceTime: {
    fontSize: 11,
    opacity: 0.6,
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
  },
  actionContainer: {
    marginTop: 6,
    marginBottom: 20,
  },
  continueButton: {
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Live Camera Viewfinder Modal Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cameraTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cameraCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetFrame: {
    alignSelf: 'center',
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#38BDF8',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraBottomRow: {
    alignItems: 'center',
    marginBottom: 30,
  },
  shutterButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});
