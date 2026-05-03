// Adapted from IS4447 lecture and tutorial examples
import { useContext, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { db } from '@/db/client';
import { categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';

export default function CategoriesScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [colour, setColour] = useState('#4CAF50');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const colours = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336', '#009688'];

  const loadCategories = async () => {
    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
  };

  useState(() => {
    loadCategories();
  });

  const saveCategory = async () => {
    setError('');
    if (!name.trim()) { setError('Please enter a category name'); return; }
    if (editingId) {
      await db.update(categoriesTable)
        .set({ name, colour })
        .where(eq(categoriesTable.id, editingId));
      setEditingId(null);
    } else {
      await db.insert(categoriesTable).values({
        name,
        colour,
        icon: 'tag',
      });
    }

    setName('');
    setColour('#4CAF50');
    await loadCategories();
  };

  const editCategory = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setColour(cat.colour);
  };

  const deleteCategory = (id: number) => {
    Alert.alert('Delete Category', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
          await loadCategories();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Categories" subtitle="Manage your categories" />

        <FormField label="Category Name" value={name} onChangeText={setName} />

        <Text style={styles.sectionLabel}>Colour:</Text>
        <View style={styles.colourRow}>
          {colours.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColour(c)}
              style={[
                styles.colourCircle,
                { backgroundColor: c },
                colour === c && styles.colourSelected,
              ]}
            />
          ))}
        </View>
        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

        <PrimaryButton
          label={editingId ? 'Save Changes' : 'Add Category'}
          onPress={saveCategory}
        />

        {editingId && (
          <View style={{ marginTop: 10 }}>
            <PrimaryButton
              label="Cancel Edit"
              variant="secondary"
              onPress={() => { setEditingId(null); setName(''); setColour('#4CAF50'); }}
            />
          </View>
        )}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Existing Categories:</Text>

        {categories.length === 0 ? (
          <Text style={styles.emptyText}>No categories yet.</Text>
        ) : (
          categories.map((cat) => (
            <View key={cat.id} style={styles.categoryCard}>
              <View style={styles.categoryRow}>
                <View style={[styles.categoryDot, { backgroundColor: cat.colour }]} />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
              <View style={styles.categoryActions}>
                <PrimaryButton label="Edit" compact onPress={() => editCategory(cat)} />
                <View style={{ marginLeft: 8 }}>
                  <PrimaryButton label="Delete" compact variant="danger" onPress={() => deleteCategory(cat.id)} />
                </View>
              </View>
            </View>
          ))
        )}

        <View style={{ marginTop: 20 }}>
          <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  colourRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  colourCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colourSelected: {
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  categoryActions: {
    flexDirection: 'row',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
  },
});