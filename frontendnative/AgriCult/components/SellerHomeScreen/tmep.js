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
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
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
          
          <Text style={styles.modalTitle}>Quote Submitted!</Text>
          <Text style={styles.modalSubtitle}>
            Your quote has been sent to the buyer.{'\n'}You'll hear back soon.
          </Text>
          
          <TouchableOpacity style={styles.findMoreButton} onPress={onClose}>
            <Text style={styles.buttonText}>Continue Browsing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const App = ({ navigation }) => {
  // ... [Previous state declarations remain the same]
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
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/images.png")}
            style={styles.profileImage}
          />
          <Text style={styles.welcomeText}>Hi, Sneha!</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color="#30534d" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={22} color="#30534d" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Active Buyers</Text>
        
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#97AFA7" />
            <Text style={styles.emptyStateText}>No orders in your region</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Ionicons name="person-circle" size={28} color="#30534d" />
                    <Text style={styles.userName}>{item.userName}</Text>
                  </View>
                  <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>Ends in</Text>
                    <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <Text style={styles.quantity}>
                    {item.quantity} Tons | {item.quality}
                  </Text>
                  
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={20} color="#1E7C57" />
                    <Text style={styles.location}>{item.deliveryLocation}</Text>
                  </View>

                  <View style={styles.qualityBadge}>
                    <Text style={styles.qualityText}>{item.region} Quality</Text>
                  </View>

                  <Text style={styles.loadingDate}>
                    Loading: {formatDate(item.loadingDate)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.quoteButton}
                  onPress={() => openBidForm(item)}
                >
                  <Text style={styles.quoteButtonText}>Submit Quote</Text>
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
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
  </Modal>)}
      {/* [Previous modal code remains the same] */}
      <QuoteSuccessModal 
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9EC",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  welcomeText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#30534d",
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#30534d",
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: "#97AFA7",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#30534d",
  },
  timerContainer: {
    alignItems: "flex-end",
  },
  timerLabel: {
    fontSize: 12,
    color: "#97AFA7",
  },
  timerValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E2872B",
  },
  orderDetails: {
    gap: 8,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "700",
    color: "#30534d",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  location: {
    fontSize: 14,
    color: "#1E7C57",
  },
  qualityBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E9F5F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#30534d",
  },
  qualityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E7C57",
  },
  loadingDate: {
    fontSize: 13,
    color: "#97AFA7",
  },
  quoteButton: {
    backgroundColor: "#30534d",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  quoteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "85%",
    maxWidth: 360,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#97AFA7",
  },
  successImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#30534d",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#97AFA7",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  findMoreButton: {
    backgroundColor: "#30534d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default App;