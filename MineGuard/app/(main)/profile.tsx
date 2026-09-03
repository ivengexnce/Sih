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
import { getUserProfileLocally, logoutUser, UserProfile } from '@/services/authService';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const { currentMine } = useInspection();
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

  const userEmail = profile?.email || auth.currentUser?.email || 'inspector@dgms.gov.in';
  const userName = profile?.name || auth.currentUser?.displayName || 'Inspector Officer';
  const officialId = profile?.officialId || 'DGMS-INSP-4011';
  const designation = profile?.designation || 'Statutory Mining Compliance Inspector';
  const phone = profile?.phone || '+91 87654 32109';
  const mineName = profile?.allocatedMine || currentMine.name;

  const handleLogout = async () => {
    await logoutUser();
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Inspector Profile
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Officer Credentials & Allocated Jurisdiction
            </ThemedText>
          </View>

          {/* Profile Overview Card */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.avatarInfo}>
                <ThemedText style={styles.profileName}>{userName}</ThemedText>
                <ThemedText style={styles.profileRole}>{designation}</ThemedText>
                <ThemedText style={styles.profileEmail}>{userEmail}</ThemedText>
              </View>
            </View>
          </View>

          {/* Statutory Credentials Card */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="ribbon-outline" size={18} color="#D97706" />
              <ThemedText style={styles.sectionHeaderTitle}>Statutory Verification</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Official Auth ID</ThemedText>
              <ThemedText style={styles.badgeValue}>{officialId}</ThemedText>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Registered Mobile</ThemedText>
              <ThemedText style={styles.detailValue}>{phone}</ThemedText>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Security Clearance</ThemedText>
              <ThemedText style={[styles.detailValue, { color: '#059669', fontWeight: '700' }]}>
                CMR 2017 Level 2 (Field Inspector)
              </ThemedText>
            </View>
          </View>

          {/* Colliery Jurisdiction Card */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="business-outline" size={18} color="#0284C7" />
              <ThemedText style={styles.sectionHeaderTitle}>Assigned Mine Jurisdiction</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Allocated Colliery</ThemedText>
              <ThemedText style={styles.detailValue}>{mineName}</ThemedText>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Mine Code</ThemedText>
              <ThemedText style={styles.detailValue}>{currentMine.code}</ThemedText>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Subsidiary</ThemedText>
              <ThemedText style={styles.detailValue}>{currentMine.subsidiary}</ThemedText>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Mine Type</ThemedText>
              <ThemedText style={styles.detailValue}>{currentMine.type}</ThemedText>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Sync Source</ThemedText>
              <ThemedText style={styles.detailValue}>Firebase Firestore Cloud</ThemedText>
            </View>
          </View>

          {/* Logout Action */}
          <View style={styles.actionContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                {
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <ThemedText
                lightColor="#DC2626"
                darkColor="#EF4444"
                style={styles.logoutButtonText}>
                Logout from Device
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
  header: {
    marginTop: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
  },
  profileRole: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0284C7',
  },
  profileEmail: {
    fontSize: 12,
    opacity: 0.65,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 12,
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(150, 150, 150, 0.25)',
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  logoutButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
