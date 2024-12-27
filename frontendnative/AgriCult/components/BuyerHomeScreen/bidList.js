import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BidsList = () => {
  const navigation = useNavigation();

  const [products, setProducts] = React.useState([
    { 
      id: '1', 
      name: 'Product #1', 
      price: '$50', 
      image: 'https://via.placeholder.com/100', 
      description: 'High-quality wireless earbuds with noise cancellation.',
      seller: 'TechCorp',
      rating: '4.5/5',
      region: 'North America',
      quantity: 25
    },
    { 
      id: '2', 
      name: 'Product #2', 
      price: '$300', 
      image: 'https://via.placeholder.com/100', 
      description: 'Latest smartphone with advanced camera features.',
      seller: 'MobileWorld',
      rating: '4.7/5',
      region: 'Europe',
      quantity: 10
    },
    { 
      id: '3', 
      name: 'Product #3', 
      price: '$1200', 
      image: 'https://via.placeholder.com/100', 
      description: 'Gaming laptop with high-end specs for seamless performance.',
      seller: 'GamingHub',
      rating: '4.8/5',
      region: 'Asia',
      quantity: 5
    },
    { 
      id: '4', 
      name: 'Product #4', 
      price: '$200', 
      image: 'https://via.placeholder.com/100', 
      description: 'Smartwatch with health monitoring and fitness tracking.',
      seller: 'WearTech',
      rating: '4.6/5',
      region: 'Australia',
      quantity: 15
    },
    { 
      id: '5', 
      name: 'Product #5', 
      price: '$800', 
      image: 'https://via.placeholder.com/100', 
      description: 'High-performance DSLR camera for professional photography.',
      seller: 'PhotoPro',
      rating: '4.9/5',
      region: 'South America',
      quantity: 8
    },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BidDetailPage', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#555',
  },
});

export default BidsList;
