import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import BottomNavBar from "./BottomNavBar";


const BuyerHomeScreen = () => {
  return (
    <View style={styles.container}>
      <BottomNavBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    fontWeight: "bold",
  },
  orderDetails: {
    gap: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 10,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1, // Content takes up the remaining space
  },
});

export default BuyerHomeScreen;
