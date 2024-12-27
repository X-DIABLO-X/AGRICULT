import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

const BidDetailPage = ({ route, navigation }) => {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.seller}>Seller: {product.seller}</Text>
      <Text style={styles.rating}>Rating: {product.rating}</Text>
      <Text style={styles.stock}>Stock: {product.quantity}</Text>
      <Text style={styles.region}>Region: {product.region}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  price: {
    fontSize: 20,
    color: '#28a745',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
    lineHeight: 22,
  },
  seller: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  rating: {
    fontSize: 16,
    color: '#ff8c00',
    marginBottom: 10,
  },
  stock: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 10,
  },
  region: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
  },
});

export default BidDetailPage;
