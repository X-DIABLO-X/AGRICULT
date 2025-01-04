import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SORT_OPTIONS = [
  { label: 'Date: Newest First', value: 'date-desc' },
  { label: 'Date: Oldest First', value: 'date-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
];

const CollectionCenter = ({ route, navigation }) => {
  const order = route.params?.product || {};
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order.orderID) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }
    fetchBids();
  }, [order.orderID]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://agricult.onrender.com/fetch/bids?orderID=${order.orderID}`);
      const data = await response.json();
      
      if (data.success) {
        const transformedBids = data.bids.map(bid => ({
          id: bid.BIDID,
          loadingDate: new Date(bid.created_at).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          price: bid.amount,
          images: bid.pic.images,
          userName: bid.userName,
          license: bid.license
        }));
        setCollections(transformedBids);
      } else {
        setError('Failed to fetch bids');
      }
    } catch (err) {
      setError('Network error while fetching bids');
    } finally {
      setLoading(false);
    }
  };

  const sortCollections = (sortOption) => {
    const sorted = [...collections].sort((a, b) => {
      switch (sortOption.value) {
        case 'date-desc':
          return new Date(b.loadingDate) - new Date(a.loadingDate);
        case 'date-asc':
          return new Date(a.loadingDate) - new Date(b.loadingDate);
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        default:
          return 0;
      }
    });
    setCollections(sorted);
    setSelectedSort(sortOption);
    setShowSortModal(false);
  };

  const Header = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Collection Center</Text>
    </View>
  );

  const CollectionHeader = () => (
    <View style={styles.collectionHeaderContainer}>
      <View>
        <Text style={styles.tonsText}>
          {order.tons || 25} Tons | {order.filterType || 'Double Filter'}
        </Text>
        <View style={styles.qualityPill}>
          <Text style={styles.qualityText}>{order.quality || 'Chamnarajnagar Quality'}</Text>
        </View>
        <Text style={styles.loadingDateText}>
          Loading Date: {order.loadingDate || '08 Jan'}
        </Text>
      </View>
    </View>
  );

  const SortButton = () => (
    <TouchableOpacity 
      style={styles.sortButton}
      onPress={() => setShowSortModal(true)}
    >
      <Text style={styles.sortButtonText}>Sort By</Text>
      <Ionicons name="chevron-down" size={20} color="#666" />
    </TouchableOpacity>
  );

  const SortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSortModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort By</Text>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                selectedSort.value === option.value && styles.selectedSortOption
              ]}
              onPress={() => sortCollections(option)}
            >
              <Text style={[
                styles.sortOptionText,
                selectedSort.value === option.value && styles.selectedSortOptionText
              ]}>
                {option.label}
              </Text>
              {selectedSort.value === option.value && (
                <Ionicons name="checkmark" size={20} color="#2D4F4D" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderCollectionItem = ({ item }) => (
    <View style={styles.collectionCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.userName}</Text>
        <Text style={styles.priceText}>Rs {item.price}</Text>
      </View>
      <Text style={styles.loadingDateLabel}>Bid Date</Text>
      <Text style={styles.dateChip}>{item.loadingDate}</Text>
      {console.log(item.images)}
      <View style={styles.imagesContainer}>
        <FlatList
          horizontal
          data={item.images}
          renderItem={({ item: imageUrl }) => (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              defaultSource={require('./placeholder.png')}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Accept')}>
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText} onPress={() => navigation.navigate('ChatInterface')}>Counter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2D4F4D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchBids}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!collections.length) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <CollectionHeader />
        <View style={styles.emptyStateContainer}>
          <Ionicons name="document-text-outline" size={64} color="#97AFA7" />
          <Text style={styles.emptyStateTitle}>No Quotes Yet</Text>
          <Text style={styles.emptyStateText}>
            You haven't received any quotes for this order yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CollectionHeader />
      <SortButton />
      <FlatList
        data={collections}
        renderItem={renderCollectionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchBids}
      />
      <SortModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  collectionHeaderContainer: {
    backgroundColor: '#2D4F4D',
    padding: 16,
  },
  tonsText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '600',
  },
  qualityPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  qualityText: {
    color: 'white',
    fontSize: 14,
  },
  loadingDateText: {
    color: 'white',
    fontSize: 14,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sortButtonText: {
    color: '#666',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  collectionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    fontSize: 20,
    color: '#F4811E',
    fontWeight: '600',
  },
  loadingDateLabel: {
    color: '#2D4F4D',
    marginBottom: 4,
    fontSize: 14,
  },
  dateChip: {
    backgroundColor: '#E8F4F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    color: '#2D4F4D',
    fontSize: 14,
  },
  imagesContainer: {
    marginVertical: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D4F4D',
  },
  actionButtonText: {
    color: '#2D4F4D',
    fontWeight: '500',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectedSortOption: {
    backgroundColor: '#E8F4F4',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSortOptionText: {
    color: '#2D4F4D',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2D4F4D',
    padding: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D4F4D',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#97AFA7',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CollectionCenter;