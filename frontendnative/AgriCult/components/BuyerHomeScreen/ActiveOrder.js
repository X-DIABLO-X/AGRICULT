import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import OrderScreen from "./OrderScreen";

const { width } = Dimensions.get('window');

const ActiveOrdersScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchUserOrders = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user");
      if (!userDataString) {
        throw new Error("User data not found");
      }

      const userData = JSON.parse(userDataString);
      setUserName(userData.userName);

      const response = await fetch(
        `https://agricult.onrender.com/fetch/orders?userName=${userData.userName}&status=true`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserOrders().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const getQuality = (qualityValue) => {
    switch (qualityValue) {
      case 0:
        return "Single Filter";
      case 1:
        return "Double Filter";
      case 2:
        return "Triple Filter";
      default:
        return "Unknown Quality";
    }
  };

  const renderOrderCard = (order) => {
    return (
      <View style={styles.newcard} key={order.id}>
        <View style={styles.cardContent}>
          <View style={styles.lleft1}>
            <Text style={styles.cardheading}>
              {order.quantity} Tons | {getQuality(order.quality)}
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color="#39665e" />
              <Text style={styles.regionText}>{order.region}</Text>
            </View>
            <View style={styles.noofbids}>
              <Text style={styles.noofbidstext}>{order.quotes} Quotes Received</Text>
            </View>
          </View>
          
          <View style={styles.right2}>
            <View style={styles.right1}>
              <Text style={styles.dateText}>Loading Date:</Text>
              <Text style={styles.dateText}> {formatDate(order.loadingDate)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("BidDetailPage", { product: order })}
              style={styles.checkquotes}
            >
              <Text style={styles.checkquotesText}>Check All Quotes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <View style={styles.left}>
            <Image
              source={require("../../assets/images.png")}
              style={styles.image}
            />
            <Text style={styles.name}>Hello {userName}!</Text>
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={() => console.log("Notification pressed")}>
              <Ionicons style={styles.usercog} name="notifications-outline" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Settings pressed")}>
              <Ionicons style={styles.usercog} name="settings-outline" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.neworder}>
          <View style={styles.textneworder}>
            <Text style={styles.neworderText}>Place New Order</Text>
            <Text style={styles.neworderText1}>
              Create RFQ for your requirements
            </Text>
          </View>
          <TouchableOpacity
            style={styles.buttonneworder}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={32} color="#30534d" />
          </TouchableOpacity>
        </View>

        <Text style={styles.RecentRFQ}>Recent RFQs</Text>
        
        {orders.map(renderOrderCard)}

        {/* Bottom Spacing View */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <OrderScreen
              navigation={{
                goBack: () => setModalVisible(false),
                navigate: (screen) => {
                  setModalVisible(false);
                  navigation.navigate(screen);
                },
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  fixedHeader: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 8,
  },
  bottomSpacing: {
    height: 100, // Adjust this value based on your bottom navigation height
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  newcard: {
    backgroundColor: "#F8FAF9",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D9E2E1",
    padding: 16,
    width: '100%',
  },
  lleft1: {
    flex: 1,
    marginRight: 10,
  },
  cardheading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2B3A37",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  regionText: {
    fontSize: 14,
    color: "#39665E",
    marginLeft: 6,
  },
  noofbids: {
    marginTop: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#39665E",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  noofbidstext: {
    fontSize: 12,
    color: "#39665E",
    fontWeight: "500",
  },
  right2: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  right1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#2B3A37",
  },
  checkquotes: {
    backgroundColor: "#39665E",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  checkquotesText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
  },
  RecentRFQ: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  neworder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#30534d",
    borderRadius: 8,
    marginBottom: 8,
  },
  textneworder: {
    flex: 1,
  },
  neworderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  neworderText1: {
    fontSize: 14,
    color: "white",
  },
  buttonneworder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fbd636",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  usercog: {
    fontSize: 24,
    marginLeft: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ActiveOrdersScreen;