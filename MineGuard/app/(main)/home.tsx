import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useInspection } from '@/context/InspectionContext';
import { auth } from '@/lib/firebase';
import { getUserProfileLocally, UserProfile } from '@/services/authService';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const { currentMine, completedInspections } = useInspection();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUserProfileLocally().then((p) => {
        if (p) setProfile(p);
      });
    }, [])
  );

  const cardBg = isDark ? '#1E2328' : '#F8FAFC';
  const cardBorder = isDark ? '#2D3748' : '#E2E8F0';

  const pendingCount = completedInspections.filter((i) => i.status === 'Pending Sync').length;
  const todayCount = completedInspections.length;

  const handleStartInspection = () => {
    router.push('/(main)/inspections/start');
  };

  const displayName = profile?.name || auth.currentUser?.displayName || (auth.currentUser?.email ? auth.currentUser.email.split('@')[0] : 'Inspector Officer');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>SMART MINE GOVERNANCE</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              CoalGuard Inspector
            </ThemedText>
            <ThemedText style={styles.welcomeText}>
              Welcome, {displayName}
            </ThemedText>
          </View>

          {/* Assigned Mine Card */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="business" size={20} color={isDark ? '#38BDF8' : '#0284C7'} />
              <ThemedText style={styles.cardHeaderTitle}>Active Jurisdiction</ThemedText>
              <View style={[styles.typeBadge, { backgroundColor: currentMine.type === 'Underground' ? '#4338CA' : '#D97706' }]}>
                <ThemedText style={styles.typeBadgeText}>
                  {currentMine.type.toUpperCase()}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.mineTitle}>{currentMine.name}</ThemedText>
            <ThemedText style={styles.mineSubtitle}>
              {currentMine.subsidiary} • {currentMine.state} ({currentMine.code})
            </ThemedText>
          </View>

          {/* Metrics Grid */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Ionicons name="clipboard-outline" size={22} color="#059669" />
              <ThemedText style={styles.metricNumber}>
                {todayCount < 10 ? `0${todayCount}` : todayCount}
              </ThemedText>
              <ThemedText style={styles.metricLabel}>{"Total Records"}</ThemedText>
            </View>

            <View style={[styles.metricCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Ionicons name="cloud-upload-outline" size={22} color="#D97706" />
              <ThemedText style={styles.metricNumber}>
                {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
              </ThemedText>
              <ThemedText style={styles.metricLabel}>Pending Sync</ThemedText>
            </View>
          </View>

          {/* Start Inspection Action */}
          <View style={styles.actionContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: isDark ? '#0284C7' : '#0369A1',
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleStartInspection}>
              <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
              <ThemedText
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
                style={styles.primaryButtonText}>
                Start New Inspection
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
    gap: 18,
  },
  header: {
    marginTop: 8,
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#0284C7',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  welcomeText: {
    fontSize: 15,
    opacity: 0.7,
    marginTop: 2,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.8,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mineTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  mineSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  metricNumber: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 4,
  },
  primaryButton: {
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
