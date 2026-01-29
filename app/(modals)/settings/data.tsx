// Principle Centered Planner - Data Management Screen
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useDataManagement } from '@/hooks/settings/useDataManagement';
import { COLORS } from '@/lib/constants/colors';
import { GAP, PADDING } from '@/lib/constants/spacing';
import { TYPOGRAPHY } from '@/lib/constants/typography';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function DataManagementScreen() {
  const {
    isExporting,
    isImporting,
    shareDataAsText,
    importData,
    clearAllData,
    getDataSize,
  } = useDataManagement();

  const [dataSize, setDataSize] = useState({ sizeKB: 0, itemCount: 0 });
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importConfirm, setImportConfirm] = useState<{ merge: boolean } | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; message: string; onDismiss?: () => void } | null>(null);

  useEffect(() => {
    loadDataSize();
  }, []);

  const loadDataSize = async () => {
    const size = await getDataSize();
    setDataSize(size);
  };

  const handleExport = async () => {
    const success = await shareDataAsText();

    if (success) {
      setInfoModal({ title: 'Export Successful', message: 'Your data has been exported. Save the JSON text to a safe location.' });
    } else {
      setInfoModal({ title: 'Export Failed', message: 'Failed to export your data. Please try again.' });
    }
  };

  const handleImport = (merge: boolean) => {
    if (!importText.trim()) {
      setInfoModal({ title: 'No Data', message: 'Please paste your exported JSON data in the text area.' });
      return;
    }
    setImportConfirm({ merge });
  };

  const confirmImport = async () => {
    if (!importConfirm) return;
    const { merge } = importConfirm;
    setImportConfirm(null);

    const success = await importData(importText, merge);

    if (success) {
      setInfoModal({
        title: 'Import Successful',
        message: merge
          ? 'Your data has been merged successfully.'
          : 'Your data has been restored successfully.',
        onDismiss: () => {
          setImportText('');
          setShowImport(false);
          loadDataSize();
        },
      });
    } else {
      setInfoModal({ title: 'Import Failed', message: 'Failed to import data. Please ensure the JSON is valid and from a compatible version.' });
    }
  };

  const handleClearData = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = async () => {
    setShowClearConfirm(false);
    const success = await clearAllData();

    if (success) {
      setInfoModal({
        title: 'Data Cleared',
        message: 'All your data has been cleared. The app will restart.',
        onDismiss: () => router.replace('/'),
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Management</Text>
        <Button onPress={() => router.back()} variant="ghost">
          Close
        </Button>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Data</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Items:</Text>
            <Text style={styles.infoValue}>{dataSize.itemCount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Size:</Text>
            <Text style={styles.infoValue}>{dataSize.sizeKB} KB</Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          <Text style={styles.sectionDescription}>
            Export all your data as JSON text for backup or transfer
          </Text>

          <Button
            onPress={handleExport}
            disabled={isExporting}
            fullWidth
          >
            {isExporting ? 'Exporting...' : 'Export All Data'}
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Import Data</Text>
          <Text style={styles.sectionDescription}>
            Import data from a previous export
          </Text>

          {!showImport ? (
            <Button
              onPress={() => setShowImport(true)}
              variant="ghost"
              fullWidth
            >
              Show Import Options
            </Button>
          ) : (
            <Card style={styles.importCard}>
              <Text style={styles.importLabel}>Paste JSON Data:</Text>
              <TextInput
                style={styles.importTextArea}
                value={importText}
                onChangeText={setImportText}
                placeholder="Paste your exported JSON data here..."
                placeholderTextColor={COLORS.text.tertiary}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />

              <View style={styles.importActions}>
                <Button
                  onPress={() => handleImport(true)}
                  disabled={isImporting || !importText.trim()}
                  style={styles.importButton}
                >
                  {isImporting ? 'Importing...' : 'Merge Data'}
                </Button>
                <Button
                  onPress={() => handleImport(false)}
                  disabled={isImporting || !importText.trim()}
                  variant="ghost"
                  style={styles.importButton}
                >
                  Replace All Data
                </Button>
              </View>

              <Button
                onPress={() => {
                  setShowImport(false);
                  setImportText('');
                }}
                variant="ghost"
                fullWidth
              >
                Cancel
              </Button>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Text style={styles.sectionDescription}>
            Permanent actions that cannot be undone
          </Text>

          <Card style={styles.dangerCard}>
            <Text style={styles.dangerTitle}>Clear All Data</Text>
            <Text style={styles.dangerText}>
              This will permanently delete all your data. Export your data first if you want to keep a backup.
            </Text>
            <Button
              onPress={handleClearData}
              variant="ghost"
              fullWidth
              style={styles.dangerButton}
            >
              Clear All Data
            </Button>
          </Card>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={showClearConfirm}
        title="Clear All Data?"
        message={'This will permanently delete all your data including mission, values, roles, goals, tasks, and achievements. This action cannot be undone.\n\nConsider exporting your data first.'}
        confirmLabel="Clear All Data"
        onConfirm={confirmClear}
        onCancel={() => setShowClearConfirm(false)}
      />

      <ConfirmModal
        visible={importConfirm !== null}
        title={importConfirm?.merge ? 'Merge Data?' : 'Replace Data?'}
        message={importConfirm?.merge
          ? 'This will merge the imported data with your existing data. Duplicates will be updated with imported values.'
          : 'This will replace all your current data with the imported data. This action cannot be undone.'}
        confirmLabel={importConfirm?.merge ? 'Merge' : 'Replace'}
        destructive={!importConfirm?.merge}
        onConfirm={confirmImport}
        onCancel={() => setImportConfirm(null)}
      />

      <ConfirmModal
        visible={infoModal !== null}
        title={infoModal?.title ?? ''}
        message={infoModal?.message ?? ''}
        confirmLabel="OK"
        destructive={false}
        onConfirm={() => { infoModal?.onDismiss?.(); setInfoModal(null); }}
        onCancel={() => { infoModal?.onDismiss?.(); setInfoModal(null); }}
      />
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
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: PADDING.lg,
    paddingBottom: PADDING['2xl'],
  },
  infoCard: {
    marginBottom: PADDING.lg,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PADDING.xs,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  section: {
    marginBottom: PADDING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.text.primary,
    marginBottom: PADDING.xs,
  },
  sectionDescription: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.tertiary,
    marginBottom: PADDING.md,
  },
  importCard: {
    gap: GAP.md,
  },
  importLabel: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  importTextArea: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    padding: PADDING.md,
    fontSize: 12,
    color: COLORS.text.primary,
    minHeight: 200,
    fontFamily: 'monospace',
  },
  importActions: {
    flexDirection: 'row',
    gap: GAP.md,
  },
  importButton: {
    flex: 1,
  },
  dangerCard: {
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  dangerTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: TYPOGRAPHY.h4.fontWeight,
    color: '#ff4444',
    marginBottom: PADDING.sm,
  },
  dangerText: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.text.secondary,
    marginBottom: PADDING.md,
    lineHeight: 20,
  },
  dangerButton: {
    marginTop: PADDING.sm,
  },
});
