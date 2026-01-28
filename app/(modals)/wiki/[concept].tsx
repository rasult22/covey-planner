// Principle Centered Planner - Wiki Concept Page
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { getRelatedConcepts, getWikiConcept } from '@/lib/constants/wikiContent';
import { router, useLocalSearchParams } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';

// Simple markdown parser for bold text (**text**)
function parseMarkdown(text: string, baseStyle: TextStyle): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter((part) => part.length > 0)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <Text key={index} style={[baseStyle, { fontWeight: '700' }]}>
            {boldText}
          </Text>
        );
      }
      return part;
    });
}

export default function WikiConceptPage() {
  const { concept: conceptId } = useLocalSearchParams<{ concept: string }>();
  const concept = getWikiConcept(conceptId || '');
  const relatedConcepts = getRelatedConcepts(conceptId || '');

  if (!concept) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Concept Not Found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.closeButton}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.dismiss()}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>{concept.emoji}</Text>
          <Text style={styles.title}>{concept.title}</Text>
          <Text style={styles.subtitle}>{concept.subtitle}</Text>
        </View>

        <Card style={styles.contentCard}>
          <Text style={styles.content}>
            {parseMarkdown(concept.content, styles.content)}
          </Text>
        </Card>

        {relatedConcepts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Concepts</Text>
            <View style={styles.relatedGrid}>
              {relatedConcepts.map((related) => (
                <TouchableOpacity
                  key={related.id}
                  onPress={() => router.push(`/(modals)/wiki/${related.id}` as any)}
                  style={styles.relatedItem}
                >
                  <Text style={styles.relatedEmoji}>{related.emoji}</Text>
                  <Text style={styles.relatedName}>{related.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Button
          onPress={() => router.dismiss()}
          variant="ghost"
          fullWidth
          style={{ marginTop: PADDING.lg }}
        >
          Return to App
        </Button>
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
  backButton: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.primary,
  },
  closeButton: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.tertiary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: PADDING.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: PADDING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: PADDING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: COLORS.surface,
  },
  content: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  relatedSection: {
    marginTop: PADDING.xl,
  },
  relatedTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.md,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP.sm,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: PADDING.sm,
    paddingHorizontal: PADDING.md,
    borderRadius: 8,
    gap: GAP.xs,
  },
  relatedEmoji: {
    fontSize: 16,
  },
  relatedName: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
  },
});
