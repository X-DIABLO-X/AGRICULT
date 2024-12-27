import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const BidDetailPage = ({ route, navigation }) => {
  const { product } = route.params;
  const [bid, setBid] = useState(product.price);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBid, setNewBid] = useState('');

  const handleBidSubmit = () => {
    const bidValue = parseInt(newBid, 10);
    if (!isNaN(bidValue) && bidValue > bid) {
      setBid(bidValue);
      setIsModalVisible(false);
      setNewBid('');
    } else {
      alert('Please enter a valid bid higher than the current bid.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>Current Bid: ₹{bid}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.seller}>Seller: {product.seller}</Text>
      <Text style={styles.stock}>Stock: {product.quantity}</Text>
      <Text style={styles.region}>Region: {product.region}</Text>

      <View style={styles.horizontalButtonContainer}>
        <TouchableOpacity
          style={styles.bidButton}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome name="gavel" size={24} color="white" />
          <Text style={styles.buttonText}>Bid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen')}
        >
          <FontAwesome name="comment" size={24} color="white" />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color="white" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Place Your Bid</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your bid"
              keyboardType="numeric"
              value={newBid}
              onChangeText={setNewBid}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Submit" onPress={handleBidSubmit} color="#28a745" />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#dc3545" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f6',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1c1c1c',
    textAlign: 'center',
  },
  price: {
    fontSize: 22,
    color: '#28a745',
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 24,
    textAlign: 'justify',
  },
  seller: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontStyle: 'italic',
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
  horizontalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  bidButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  chatButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  goBackButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BidDetailPage;
