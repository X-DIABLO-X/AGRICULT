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
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

const App = ({ navigation }) => {
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
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://agricult.onrender.com/fetch/orders/"
      );
      const data = await response.json();
      if (data.success) {
        const formattedOrders = data.orders.map((order) => ({
          id: order.orderID,
          product: `Order #${order.id}`,
          region: order.region,
          quantity: order.quantity,
          quality: order.quality,
          deliveryLocation: order.deliveryLocation,
          loadingDate: order.loadingDate,
          userName: order.userName,
          bids: [],
        }));
        setOrders(formattedOrders);
      } else {
        alert("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("An error occurred while fetching orders.");
    }
  };

  useEffect(() => {
    const regionFiltered = orders.filter(
      (order) => order.region === userRegion
    );
    setFilteredOrders(regionFiltered);
  }, [userRegion, orders]);

  const handleLogout = () => {
    console.log("User  logged out");
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

  const handlePastBids = () => {
    navigation.navigate("PastBidsScreen");
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

  const handleChatButtonPress = () => {
    navigation.navigate("ChatList");
  };

  const regions = [
    "Karepta",
    "Hollesphure",
    "Chamarajanagar",
    "Mandya",
 "Polyachi",
    "Madhur",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={handleChatButtonPress}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.profileText}>Hi, Wilson!</Text>
       
        <TouchableOpacity style={styles.profileActionButton} onPress={handlePastBids}>
          <Ionicons name="time-outline" size={24} color="#fff" />
          <Text style={styles.profileActionText}>Past Bids</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setProfileModalVisible(true)}
          style={styles.profileButton}
        >
          <Ionicons name="person-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {profileModalVisible && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={profileModalVisible}
    onRequestClose={() => setProfileModalVisible(false)}
  >
    <View style={styles.modalBackground}>
      <View style={styles.profileModalContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle-outline" size={80} color="#1E7C57" />
          <Text style={styles.profileUserName}>Hi, Wilson!</Text>
        </View>

        {/* Actions */}
       
        
        <TouchableOpacity style={styles.profileActionButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.profileActionText}>Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeProfileModalButton} onPress={() => setProfileModalVisible(false)}>
          <Text style={styles.closeModalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


<View style={styles.content}>
      <Text style={styles.title}>Orders in Your Region</Text>
      {filteredOrders.length === 0 ? (
        <Text>No orders available in your region.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View style={styles.row}>
               
                <Text style={styles.productText}>{item.product}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="location" size={20} />
                <Text style={styles.regionLabel}>Region: {item.region}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="layers" size={20} color={'#1E7C57'} />
                <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="business" size={20} />
                <Text style={styles.locationText}>Delivery Location: {item.deliveryLocation}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="calendar" size={20} />
                <Text style={styles.dateText}>Loading Date: {item.loadingDate}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="hammer" size={20} />
                <Text style={styles.bidCountText}>Number of Bids: {item.bids.length}</Text>
              </View>
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
      )}
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
        <View style={styles.detailSection}>
          <Ionicons name="cart-outline" size={20} color="#1E7C57" />
          <Text style={styles.detailText}>Product: {orderDetails.product}</Text>
        </View>
        <View style={styles.detailSection}>
          <Ionicons name="location-outline" size={20} color="#1E7C57" />
          <Text style={styles.detailText}>Region: {orderDetails.region}</Text>
        </View>
        <View style={styles.detailSection}>
          <Ionicons name="layers-outline" size={20} color="#1E7C57" />
          <Text style={styles.detailText}>Quantity: {orderDetails.quantity}</Text>
        </View>
        <View style={styles.detailSection}>
          <Ionicons name="navigate-outline" size={20} color="#1E7C57" />
          <Text style={styles.detailText}>
            Delivery Location: {orderDetails.deliveryLocation}
          </Text>
        </View>
        <View style={styles.detailSection}>
          <Ionicons name="calendar-outline" size={20} color="#1E7C57" />
          <Text style={styles.detailText}>
            Loading Date: {orderDetails.loadingDate}
          </Text>
        </View>
        <Text style={styles.bidTitle}>
          Number of Bids: {orderDetails.bids.length}
        </Text>
        {orderDetails.bids.map((bid, index) => (
          <View key={index} style={styles.bidCard}>
            <Text style={styles.bidText}>Bid Amount: {bid.bid}</Text>
            <Text style={styles.bidText}>Date: {bid.date}</Text>
            {bid.images && bid.images.length > 0 && (
              <FlatList
                data={bid.images}
                horizontal
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <View style={styles.imagePreview}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.bidImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              />
            )}
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
      <View style={styles.bidModalContent}>
        <Text style={styles.modalTitle}>Submit Your Bid</Text>
        
        <Text style={styles.modalText}>
          You're bidding on: <Text style={styles.orderHighlight}>{selectedOrder.product}</Text>
        </Text>
        
        {/* Bid Amount Input */}
        <TextInput
          style={styles.bidInput}
          placeholder="Enter your bid amount (e.g., 500)"
          keyboardType="numeric"
          value={currentBid}
          onChangeText={setCurrentBid}
        />
        
        {/* Error Feedback */}
        {currentBid && (isNaN(currentBid) || parseFloat(currentBid) <= 0) && (
          <Text style={styles.errorText}>Please enter a valid positive number.</Text>
        )}
        
        {/* Image Upload Section */}
        <View style={styles.imageUploadSection}>
          <TouchableOpacity onPress={openImagePicker} style={styles.imageUploadButton}>
            <Ionicons name="image-outline" size={20} color="#fff" />
            <Text style={styles.imageUploadButtonText}>Upload Image(s)</Text>
          </TouchableOpacity>
          <Text style={styles.imageLimitText}>
            {images.length} / 5 images uploaded
          </Text>
        </View>

        {/* Preview of Images */}
        {images.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {images.map((img, index) => (
              <View key={index} style={styles.imagePreview}>
                <Text style={styles.imagePreviewText}>{img.fileName}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Action Buttons */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#1E7C57" />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleMakeBid}>
            <Text style={styles.submitButtonText}>Submit Bid</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={closeBidForm}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: "#efefec",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E7C57",
  },
  regionPicker: {
    width: 150,
    color: "#1E7C57",
  },
  content: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignContent: "center",
    textAlign: "center",
    marginBottom: 10,
    color: "#1E7C57",
  },
  orderItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productText: {
    fontSize: 32,
    fontFamily: "serif",
    fontWeight: "bold",
    color: "#1E7C57",
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
  row: {
    flexDirection: 'row',    // Ensures items are placed horizontally
    alignItems: 'center',    // Vertically centers the items
  },
  bidCountText: {

    fontSize: 14,
    color: "#333",
    // marginTop: 2,
    // marginLeft: 2,
  },
  bidButton: {
    marginTop: 10,
    backgroundColor: "#1E7C57",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1E7C57",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  bidInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  closeModalButton: {
    marginTop: 10,
    backgroundColor: "#1E7C57",
    padding: 10,
    borderRadius: 5,
  },
  closeModalButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1E7C57",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 10,
    zIndex: 10,
  },
  profileButton: {
    color: "#1E7C57",
    backgroundColor: "#1E7C57",
    borderRadius: 50,
    marginLeft: 10,
  },
  profileModalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileUserName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#1E7C57",
  },
  profileActionButton: {

    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E7C57",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: "50%",
  },
  profileActionText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  closeProfileModalButton: {
    marginTop: 20,
    backgroundColor: "#ccc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeProfileModalButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  detailSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  bidTitle: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#1E7C57",
  },
  bidCard: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 10,
  },
  bidText: {
    fontSize: 14,
    color: "#333",
  },
  bidModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    alignItems: "center",
  },
  orderHighlight: {
    fontWeight: "bold",
    color: "#1E7C57",
  },
  imageUploadSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E7C57",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  imageUploadButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  imageLimitText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imagePreview: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  imagePreviewText: {
    fontSize: 14,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#1E7C57",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  
});



export default App;