import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useState, useCallback } from 'react';

// Define a type for the tattoo style item
interface TattooStyle {
  id: string;
  name: string;
  image: any; // Using 'any' for now, ideally we'd use a more specific type
}

// Sample tattoo style data
const tattooStyles: TattooStyle[] = [
  { id: '1', name: 'Traditional', image: require('@/assets/images/placeholder.png') },
  { id: '2', name: 'Neo-Traditional', image: require('@/assets/images/placeholder.png') },
  { id: '3', name: 'Watercolor', image: require('@/assets/images/placeholder.png') },
  { id: '4', name: 'Realistic', image: require('@/assets/images/placeholder.png') },
  { id: '5', name: 'Geometric', image: require('@/assets/images/placeholder.png') },
  { id: '6', name: 'Japanese', image: require('@/assets/images/placeholder.png') },
  { id: '7', name: 'Tribal', image: require('@/assets/images/placeholder.png') },
  { id: '8', name: 'Blackwork', image: require('@/assets/images/placeholder.png') },
  { id: '9', name: 'New School', image: require('@/assets/images/placeholder.png') },
  { id: '10', name: 'Minimalist', image: require('@/assets/images/placeholder.png') },
  { id: '11', name: 'Dotwork', image: require('@/assets/images/placeholder.png') },
  { id: '12', name: 'Sketch', image: require('@/assets/images/placeholder.png') },
];

// Sample filter categories
const filterCategories = [
  'All Styles', 'Popular', 'Color', 'Black & White', 'Abstract', 'Detailed', 'Simple'
];

export default function EditPage() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Styles');

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (selectedStyle) {
      console.log(`Applying style: ${selectedStyle}`);
      // Navigate to the processing page
      router.push('/processing' as any);
    }
  };

  const renderStyleItem = useCallback(({ item }: { item: TattooStyle }) => (
    <TouchableOpacity 
      style={[
        styles.styleItem,
        selectedStyle === item.id && styles.selectedStyleItem
      ]}
      onPress={() => setSelectedStyle(item.id)}
    >
      <Image source={item.image} style={styles.styleImage} />
      <View style={styles.styleNameContainer}>
        <Text style={styles.styleName}>{item.name}</Text>
      </View>
      {selectedStyle === item.id && (
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-circle" size={24} color={colors.accent[100]} />
        </View>
      )}
    </TouchableOpacity>
  ), [selectedStyle]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={28} color={colors.black[100]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Style</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterCategories.map((filter) => (
          <TouchableOpacity 
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text 
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Style Grid */}
      <FlatList
        data={tattooStyles}
        renderItem={renderStyleItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[
          styles.floatingButton,
          !selectedStyle && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={!selectedStyle}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white[100],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.heading3({ color: colors.black[100] }),
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: colors.white[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.white[300],
    paddingBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: colors.white[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  activeFilterButton: {
    backgroundColor: colors.accent[100],
  },
  filterText: {
    ...typography.bodyMedium({ color: colors.black[400] }),
  },
  activeFilterText: {
    color: colors.white[100],
  },
  gridContainer: {
    padding: 12,
    paddingBottom: 80, // Space for the floating button
    gap: 0,
  },
  styleItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white[200],
    borderWidth: 2, 
    borderColor: colors.white[300],
    padding:4,
    gap: 4,
    
  },
  selectedStyleItem: {
    borderWidth: 2,
    borderColor: colors.accent[100],
    boxSizing: 'content-box',
  },
  styleImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  styleNameContainer: {
    padding: 8,
    backgroundColor: colors.white[100],
    height: 40,
    borderRadius: 8,
  },
  styleName: {
    ...typography.bodyMedium({ color: colors.black[100] }),
    textAlign: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white[100],
    borderRadius: 12,
    padding: 2,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.accent[100],
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: colors.black[100],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: colors.accent[400],
    opacity: 0.7,
  },
  buttonText: {
    ...typography.buttonLarge({ color: colors.white[100] }),
  },
}); 