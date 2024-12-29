import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import RadioGroup from "react-native-radio-buttons-group";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderScreen = ({navigation}) => {
  const [quantity, setQuantity] = useState("12");
  const [qualityType, setQualityType] = useState("single");
  const [region, setRegion] = useState("");
  const [loadingDate, setLoadingDate] = useState(new Date());
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          // Pre-fill delivery location with user's location if available
          if (parsedUser.location) {
            setDeliveryLocation(parsedUser.location);
          }
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    getUserData();
  }, []);

  const quantities = ["12", "15", "18", "25", "30"];
  const regions = [
    "Chamarajanagar",
    "Madhur",
    "Karepta",
    "Mandya",
    "Hollesphure",
    "Polyachi",
  ];

  const radioButtons = [
    { id: "0", label: "Single Filter", value: "single", size: 15 },
    { id: "1", label: "Double Filter", value: "double", size: 15 },
    { id: "2", label: "Mixed", value: "mixed", size: 15 },
  ];

  const handleSubmit = async () => {
    if (!region || !deliveryLocation) {
      Alert.alert("Error", "Please fill all mandatory fields");
      return;
    }

    if (!userData) {
      Alert.alert("Error", "User data not available. Please login again.");
      return;
    }

    // Submit order to backend with user data
    const orderData = {
      quantity,
      qualityType,
      region,
      loadingDate,
      deliveryLocation,
      userName: userData.userName,
      businessName: userData.businessName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
    };
    
    try {
      const response = await axios.post(
        "https://agricult.onrender.com/new/order/",
        orderData
      );
      
      if (response.data.success) {
        Alert.alert(
          "Success", 
          "Order submitted! RFQ valid for 24 hours",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error", "Failed to submit order. Please try again");
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      Alert.alert("Error", "Failed to submit order. Please check your connection");
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.businessName}>{userData.businessName}</Text>
        <Text style={styles.userName}>@{userData.userName}</Text>
      </View>

      <Text style={styles.label}>Quantity (tons)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={quantity}
          onValueChange={setQuantity}
          style={styles.picker}
        >
          {quantities.map((q) => (
            <Picker.Item key={q} label={`${q} tons`} value={q} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Quality Type</Text>
      <View style={styles.radioGroupContainer}>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setQualityType}
          selectedId={qualityType}
          containerStyle={styles.radioGroup}
          flexDirection="row"
        />
      </View>

      <Text style={styles.label}>Region *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={region}
          onValueChange={setRegion}
          style={styles.picker}
        >
          <Picker.Item label="Select Region" value="" />
          {regions.map((r) => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Loading Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {loadingDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <RNDateTimePicker
          value={loadingDate}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setLoadingDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Delivery Location *</Text>
      <TextInput
        style={styles.input}
        value={deliveryLocation}
        onChangeText={setDeliveryLocation}
        placeholder="Enter delivery location"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userName: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  radioGroupContainer: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OrderScreen;