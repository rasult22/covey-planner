// Covey Planner - Wiki Home
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/lib/constants/colors';
import { PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { WIKI_CONCEPTS } from '@/lib/constants/wikiContent';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WikiIndex() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn the Method</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Understand the core concepts of principle-centered planning
        </Text>

        {WIKI_CONCEPTS.map((concept) => (
          <TouchableOpacity
            key={concept.id}
            onPress={() => router.push(`/(modals)/wiki/${concept.id}` as any)}
          >
            <Card style={styles.conceptCard}>
              <View style={styles.conceptRow}>
                <Text style={styles.conceptEmoji}>{concept.emoji}</Text>
                <View style={styles.conceptContent}>
                  <Text style={styles.conceptTitle}>{concept.title}</Text>
                  <Text style={styles.conceptSubtitle}>{concept.subtitle}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PADDING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.text.primary,
  },
  closeButton: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.lg,
  },
  conceptCard: {
    marginBottom: PADDING.md,
  },
  conceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conceptEmoji: {
    fontSize: 28,
    marginRight: PADDING.md,
  },
  conceptContent: {
    flex: 1,
  },
  conceptTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  conceptSubtitle: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.text.tertiary,
  },
});
