import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({ userData }) => (
  <ImageBackground
    source={require("./circles.png")}
    style={styles.headerBackground}
    resizeMode="cover"
  >
    <View style={styles.header}>
      <View style={styles.circle}>
        <Image
          style={styles.profileImage}
          source={{
            uri: userData.profileImage || "https://via.placeholder.com/100",
          }}
        />
      </View>
      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.businessName}>{userData.businessName}</Text>
    </View>
  </ImageBackground>
);

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue) {
        const user = JSON.parse(jsonValue);
        setUserData(user);
      } else {
        Alert.alert("No user data found");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      Alert.alert("Error", "Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E7C57" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {userData && <Header userData={userData} />}
      <View style={styles.boxContainer}>
        {[
          { label: "Full Name", value: userData.fullName },
          { label: "Username", value: userData.userName },
          { label: "Phone Number", value: userData.phoneNumber },
          { label: "Email", value: userData.email },
          { label: "Business Name", value: userData.businessName },
          { label: "Location", value: userData.location },
          {
            label: "Member Since",
            value: new Date(userData.created_at).toLocaleDateString(),
          },
        ].map((item, index) => (
          <DetailRow key={index} label={item.label} value={item.value} />
        ))}
      </View>
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => console.log("Edit Profile")}
        accessibilityLabel="Edit your profile"
      >
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  headerBackground: {
    width: "100%",
    height: 260,
  },
  header: {
    height: 260,
    backgroundColor: "#1E7C57",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  businessName: {
    fontSize: 16,
    color: "#fff",
  },
  boxContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: -40,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
    textAlign: "right",
  },
  editProfileButton: {
    backgroundColor: "#1E7C57",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 25,
    shadowColor: "#1E7C57",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  editProfileText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});