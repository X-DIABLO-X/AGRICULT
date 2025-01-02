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
  Image,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
const QuoteSuccessModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Image 
            source={require('../../assets/success-illustration.png')} 
            style={styles.successImage}
          />
          
          <Text style={styles.title}>Your quote submitted successfully!</Text>
          <Text style={styles.subtitle}>
            Your quote is sent to the buyer,Please{'\n'}Expect to hear from him soon.
          </Text>
          
          <TouchableOpacity style={styles.findMoreButton} onPress={onClose}>
            <Text style={styles.buttonText}>Find More Buyers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setShowSuccessModal(true);
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

  const [timeLeft, setTimeLeft] = useState(3665); // Initial time in seconds (e.g., 1 hour, 1 minute, 5 seconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  // Convert timeLeft into hours, minutes, and seconds
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const closeBidForm = () => {
    setBidModalVisible(false);
    setSelectedOrder(null);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
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
      <View style={styles.header}>
        <View style={styles.left}>
          <Image
            source={require("../../assets/images.png")}
            style={styles.image}
          />
          <Text style={styles.name}>Hello Sneha!</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
            <Ionicons style={styles.usercog} name="notifications-outline" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Settings pressed")}>
            <Ionicons style={styles.usercog} name="settings-outline" />
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.header}>
        <Text style={styles.profileText}>Hi, Wilson!</Text>
       
       
        <TouchableOpacity
          onPress={() => setProfileModalVisible(true)}
          style={styles.profileButton}
        >
          <Ionicons name="person-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View> */}
       <QuoteSuccessModal 
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

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
                <Ionicons
                  name="person-circle-outline"
                  size={80}
                  color="#1E7C57"
                />
                <Text style={styles.profileUserName}>Hi, Wilson!</Text>
              </View>

              {/* Actions */}

              <TouchableOpacity
                style={styles.profileActionButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.profileActionText}>Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeProfileModalButton}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>My Buyers</Text>
        {filteredOrders.length === 0 ? (
          <Text>No orders available in your region.</Text>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <>
                <View style={styles.newCard}>
                  <View style={styles.leftSection}>
                    <View style={styles.orderItem}>
                      <View style={styles.row}>
                        <Ionicons
                          style={styles.icon}
                          name="person"
                          size={32}
                          color={"#1E7C57"}
                        />
                        <Text style={styles.userNameText}>{item.userName}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.quantityText}>
                          {item.quantity} Tons | {item.quality}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Ionicons
                          style={styles.locationIcon}
                          name="location"
                          size={30}
                          color={"#1E7C57"}
                        />
                        <Text style={styles.locationText}>
                          {item.deliveryLocation}
                        </Text>
                      </View>
                      <View style={styles.regionBox}>
                        <Text style={styles.regionLabel}>
                          {item.region} Quality
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.dateText}>
                          Loading Date: {formatDate(item.loadingDate)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.rightSection}>
                    <View style={styles.timerContainer}>
                      <Text style={styles.timerTitle}>Expiring in</Text>
                      <Text style={styles.timerText}>
                        {formatTime(timeLeft)} Hrs
                      </Text>
                    </View>
                    <View style={styles.submitButtonContainer}>
                      <TouchableOpacity
                        style={styles.submitQuote}
                        onPress={() => openBidForm(item)}
                      >
                        <Text style={styles.submitbidd}>Submit Quote</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                ;
              </>
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
                <Text style={styles.detailText}>
                  Product: {orderDetails.product}
                </Text>
              </View>
              <View style={styles.detailSection}>
                <Ionicons name="location-outline" size={20} color="#1E7C57" />
                <Text style={styles.detailText}>
                  Region: {orderDetails.region}
                </Text>
              </View>
              <View style={styles.detailSection}>
                <Ionicons name="layers-outline" size={20} color="#1E7C57" />
                <Text style={styles.detailText}>
                  Quantity: {orderDetails.quantity}
                </Text>
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
        <View style={styles.newBidModalHeader}>
          <View style={styles.buyerRow}>
            <Ionicons name="person-outline" size={24} color="#fff" />
            <Text style={styles.buyerText}>{selectedOrder.userName}</Text>
          </View>
          <View style={styles.expiringRow}>
            <Text style={styles.expiringText}>Expiring in</Text>
            <Text style={styles.timerValue}>{formatTime(timeLeft)} Hrs</Text>
          </View>
          <Text style={styles.quantityHeader}>
            {selectedOrder.quantity} | {selectedOrder.quality}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={24} color="#fff" />
            <Text style={styles.locationHeader}>{selectedOrder.deliveryLocation}</Text>
          </View>
          <View style={styles.qualityBadge}>
            <Text style={styles.qualityText}>{selectedOrder.region} Quality</Text>
          </View>
          <Text style={styles.loadingDate}>
            Loading Date: {formatDate(selectedOrder.loadingDate)}
          </Text>
        </View>

        <View style={styles.bidFormContainer}>
          <Text style={styles.bidFormTitle}>Enter Your Price(per Nut)</Text>
          
          <TextInput
            style={styles.bidInput}
            placeholder="Enter Price"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={currentBid}
            onChangeText={setCurrentBid}
          />

          {currentBid && (isNaN(currentBid) || parseFloat(currentBid) <= 0) && (
            <Text style={styles.errorText}>Please enter a valid positive number.</Text>
          )}
          

          <View style={styles.imageUploadSection}>
            <TouchableOpacity
              onPress={openImagePicker}
              style={styles.imageUploadButton}
            >
              <Ionicons name="image-outline" size={20} color="#fff" />
              <Text style={styles.imageUploadButtonText}>Upload Images</Text>
            </TouchableOpacity>
            
          </View>

          {images.length > 0 && (
            <ScrollView 
              horizontal 
              style={styles.imagePreviewScroll}
              showsHorizontalScrollIndicator={false}
            >
              {images.map((img, index) => (
                <View key={index} style={styles.imagePreviewCard}>
                  <Image
                    source={{ uri: img.uri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => {
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setImages(newImages);
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#30534d" />
            ) : (
              <TouchableOpacity 
                style={styles.submitBidButton} 
                onPress={handleMakeBid}
              >
                <Text style={styles.submitBidText}>Submit Bid</Text>
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
      </View>
    </View>
  </Modal>
)}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#97AFA7',
  },
  successImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#30534D',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#97AFA7',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  findMoreButton: {
    backgroundColor: '#30534D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bidModalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '90%',
    borderRadius: 15,
    overflow: 'hidden'
  },
  newBidModalHeader: {
    backgroundColor: '#30534d',
    padding: 20,
    width: '100%'
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  buyerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  expiringRow: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'flex-end'
  },
  expiringText: {
    color: '#ffd700',
    fontSize: 14
  },
  timerValue: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold'
  },
  quantityHeader: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  locationHeader: {
    color: '#fff',
    fontSize: 18
  },
  qualityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12
  },
  qualityText: {
    color: '#fff',
    fontSize: 14
  },
  loadingDate: {
    color: '#fff',
    fontSize: 14
  },
  bidFormContainer: {
    padding: 20
  },
  bidFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30534d',
    marginBottom: 15
  },
  bidInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    marginBottom: 15
  },
  imageUploadSection: {
    marginBottom: 15
  },
  imageUploadButton: {
    backgroundColor: '#30534d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  imageUploadButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16
  },
  imageLimitText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center'
  },
  imagePreviewScroll: {
    maxHeight: 100,
    marginBottom: 15
  },
  imagePreviewCard: {
    marginRight: 10,
    position: 'relative'
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12
  },
  buttonContainer: {
    gap: 10
  },
  submitBidButton: {
    backgroundColor: '#30534d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitBidText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  
  userInfo: {
    flex: 1
  },
  
  bidModalHeader: {
    backgroundColor: '#f4f9f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%'
  },
  
  bidModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%'
  },
  
  timerContainer: {
    alignItems: 'center',
    marginLeft: 10
  },
  
  timerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2872b'
  },
  
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2872b'
  },
  submitQuote: {
    backgroundColor: "#30534d",
    padding: 10,
    width: "95%",

    borderRadius: 5,
  },
  submitbidd: {
    backgroundColor: "#30534d",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  newCard: {
    width: "100%",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f9f8",
  },
  leftSection: {
    width: "62%",
    justifyContent: "flex-start",
  },
  rightSection: {
    justifyContent: "flex-end",

    width: "40%",
    alignItems: "flex-end",
  },
  orderItem: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    color: "#30534d",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#30534d",
    borderRadius: 10,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E7C57",
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#1E7C57",
  },
  regionBox: {
    borderWidth: 2,
    width: 120,
    borderColor: "#30534d",
    backgroundColor: "#e9f5f3",
    borderRadius: 50,
    padding: 5,
    marginTop: 5,
  },
  regionLabel: {
    fontSize: 14,
    color: "#1E7C57",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  timerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e2872b",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e2872b",
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#30534d",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    marginTop: 30,
    flexDirection: "row", // Arrange horizontally
    justifyContent: "space-between", // Space between left and right sections
    alignItems: "center", // Center vertically
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  usercog: {
    fontSize: 24,
    marginHorizontal: 5,
  },

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
  regionbox: {
    width: 120,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#30534d",
  },
  content: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",

    marginBottom: 10,
    color: "black",
  },

  productText: {
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "bold",
    color: "black",
  },

  regionLabel: {
    fontSize: 14,
    color: "#666",
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "300",
    color: "black",
  },
  locationText: {
    fontSize: 20,
    color: "#1E7C57",
  },
  loacationIcon: {
    color: "#1E7C57",
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#30534d",
  },
  row: {
    flexDirection: "row", // Ensures items are placed horizontally
    alignItems: "center", // Vertically centers the items
  },
  bidCountText: {
    fontSize: 14,
    color: "#333",
    // marginTop: 2,
    // marginLeft: 2,
  },
  bidButton: {
    marginTop: 10,
    backgroundColor: "#30534d",
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
