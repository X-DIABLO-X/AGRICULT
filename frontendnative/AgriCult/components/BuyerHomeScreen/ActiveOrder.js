import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl, // Added RefreshControl import
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const navigation = useNavigation();
  const quality = () => {
    switch (order.quality) {
      case 1:
        return "Single Filter";
      case 2:
        return "Double Filter";
      case 3:
        return "Triple Filter";
      default:
        return "Unknown Quality";
    }
  };

  return (
    <View style={styles.newcard}>
      <View style={styles.lleft1}>
        <Text style={styles.cardheading}>
          {order.quantity} Tons | {quality()}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#39665e" />
          <Text style={styles.regionText}>{order.region}</Text>
        </View>
        <View style={styles.noofbids}>
          <Text style={styles.noofbidstext}>{order.quotes} 5 Quotes Received</Text>
        </View>
      </View>

      <View style={styles.right2}>
        <View style={styles.right1}>
          <Text style={styles.dateText}>Loading Date: </Text>
          <Text style={styles.dateText}>{formatDate(order.loadingDate)}</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BidDetailPage", { product: order })
          }
        >
          <View style={styles.checkquotes}>
            <Text style={styles.checkquotesText}>Check All Quotes</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ActiveOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state
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

  // Added onRefresh function
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserOrders().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchUserOrders();
  }, []);

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
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4caf50"]} // Android
          tintColor="#4caf50" // iOS
        />
      }
    >
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

      <View style={styles.neworder}>
        <View style={styles.textneworder}>
          <Text style={styles.neworderText}>Place New Order</Text>
          <Text style={styles.neworderText1}>
            Create RFQ for your requirements
          </Text>
        </View>
        <TouchableOpacity
          style={styles.buttonneworder1}
          onPress={() => navigation.navigate("PlaceOrder")}
        >
          <View style={styles.buttonneworder}>
            <Ionicons style={styles.plus} name="add" size={32} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.RecentRFQ}>Recent RFQs</Text>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // General Container Styles
  newcard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAF9",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D9E2E1",
  },

  lleft1: {
    flex: 1,
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
    flex: 0.5,
  },

  right1: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 4,
  },

  dateText: {
    fontSize: 12,
    color: "#2B3A37",
  },

  checkquotes: {
    gap: 8,
    marginTop: 18,
    width: 140,
    height: 40,
    backgroundColor: "#39665E",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
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
  plus: {
    fontweight: "bold",
    fontSize: 32,
    color: "#30534d",
  },
  neworder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#30534d",
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  buttonneworder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fbd636",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
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
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#4caf50",
  },
  orderNo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 8,
  },
  orderDetails: {
    marginTop: 4,
  },
  orderText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  noOrdersText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ActiveOrdersScreen;