import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";

const App = () => {
  const [orders, setOrders] = useState([]);
  const [userRegion, setUserRegion] = useState("Karepta");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [currentBid, setCurrentBid] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://00z67rj6-3000.inc1.devtunnels.ms/fetch/orders');
      const data = await response.json();
      if (data.success) {
        const formattedOrders = data.orders.map(order => ({
          id: order.orderID,
          product: `Order #${order.id}`,
          region: order.region,
          quantity: order.quantity,
          quality: order.quality,

          deliveryLocation: order.deliveryLocation,
          loadingDate: order.loadingDate,
          userName: order.userName,
          bids: []
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    const regionFiltered = orders.filter(
      (order) => order.region === userRegion
    );
    setFilteredOrders(regionFiltered);
  }, [userRegion, orders]);

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleMakeBid = () => {
    if (!currentBid || isNaN(currentBid) || parseFloat(currentBid) <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    setIsLoading(true);
    const confirmationDate = new Date().toLocaleString();

    setTimeout(() => {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            bids: [
              ...order.bids,
              { bid: currentBid, date: confirmationDate, images },
            ],
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setBidModalVisible(false);
      setCurrentBid("");
      setImages([]);
      setIsLoading(false);
    }, 1000);
  };

  const openOrderDetails = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setOrderDetails(order);
    setModalVisible(true);
  };

  const closeOrderDetails = () => {
    setModalVisible(false);
    setOrderDetails(null);
  };

  const openBidForm = (order) => {
    setSelectedOrder(order);
    setBidModalVisible(true);
  };

  const closeBidForm = () => {
    setBidModalVisible(false);
    setSelectedOrder(null);
  };

  const openImagePicker = () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 5 - images.length },
      (response) => {
        if (response.assets) {
          const newImages = [...images, ...response.assets];
          setImages(newImages);
        }
      }
    );
  };

  const regions = ["Karepta", "Hollesphure", "South", "East", "West"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.profileText}>Hi, Wilson!</Text>
        <Picker
          selectedValue={userRegion}
          style={styles.regionPicker}
          onValueChange={(itemValue) => setUserRegion(itemValue)}
        >
          {regions.map((region) => (
            <Picker.Item key={region} label={region} value={region} />
          ))}
        </Picker>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Orders in Your Region</Text>
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.productText}>{item.product}</Text>
              <Text style={styles.regionLabel}>Region: {item.region}</Text>
              <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
              <Text style={styles.locationText}>
                Delivery Location: {item.deliveryLocation}
              </Text>
              <Text style={styles.dateText}>
                Loading Date: {item.loadingDate}
              </Text>
              <Text style={styles.bidCountText}>
                Number of Bids: {item.bids.length}
              </Text>
              <TouchableOpacity
                style={styles.bidButton}
                onPress={() => openBidForm(item)}
              >
                <Text style={styles.bidButtonText}>Make a Bid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.orderDetailsButton}
                onPress={() => openOrderDetails(item.id)}
              >
                <Text style={styles.orderDetailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {orderDetails && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeOrderDetails}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <Text style={styles.modalText}>
                Product: {orderDetails.product}
              </Text>
              <Text style={styles.modalText}>
                Region: {orderDetails.region}
              </Text>
              <Text style={styles.modalText}>
                Quantity: {orderDetails.quantity}
              </Text>
              <Text style={styles.modalText}>
                Delivery Location: {orderDetails.deliveryLocation}
              </Text>
              <Text style={styles.modalText}>
                Loading Date: {orderDetails.loadingDate}
              </Text>
              <Text style={styles.modalText}>
                Number of Bids: {orderDetails.bids.length}
              </Text>
              {orderDetails.bids.map((bid, index) => (
                <View key={index} style={styles.bidDetails}>
                  <Text style={styles.modalText}>Bid Amount: {bid.bid}</Text>
                  <Text style={styles.modalText}>Date: {bid.date}</Text>
                  {bid.images &&
                    bid.images.map((img, i) => (
                      <Text key={i} style={styles.modalText}>
                        Image {i + 1}: {img.uri}
                      </Text>
                    ))}
                </View>
              ))}
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={closeOrderDetails}
              >
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {selectedOrder && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={bidModalVisible}
          onRequestClose={closeBidForm}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Submit Your Bid</Text>
              <Text style={styles.modalText}>
                Order: {selectedOrder.product}
              </Text>
              <TextInput
                style={styles.bidInput}
                placeholder="Enter your bid amount"
                keyboardType="numeric"
                value={currentBid}
                onChangeText={setCurrentBid}
              />
              <TouchableOpacity
                onPress={openImagePicker}
                style={styles.bidButton}
              >
                <Text style={styles.bidButtonText}>Upload Image(s)</Text>
              </TouchableOpacity>
              <View>
                {images.map((img, index) => (
                  <Text key={index} style={styles.modalText}>
                    Image {index + 1}: {img.fileName}
                  </Text>
                ))}
              </View>
              {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" />
              ) : (
                <TouchableOpacity
                  style={styles.bidButton}
                  onPress={handleMakeBid}
                >
                  <Text style={styles.bidButtonText}>Submit Quote</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={closeBidForm}
              >
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  regionPicker: {
    width: 150,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#ff5555",
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
  },
  content: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  orderItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  productText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  regionLabel: {
    fontSize: 14,
    color: "#666",
  },
  quantityText: {
    fontSize: 14,
    color: "#333",
  },
  locationText: {
    fontSize: 14,
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  bidCountText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  bidButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  bidButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  orderDetailsButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  orderDetailsButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  bidDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  closeModalButton: {
    marginTop: 10,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  closeModalText: {
    color: "#fff",
    textAlign: "center",
  },
  bidInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;