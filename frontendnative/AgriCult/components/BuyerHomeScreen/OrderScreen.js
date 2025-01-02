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
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const RadioButton = ({ options, onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handlePress = (option) => {
    setSelected(option);
    onSelect(option); // Pass the selected value to the parent component
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, selected === option && styles.selectedButton]}
          onPress={() => handlePress(option)}
        >
          <Text style={styles.text}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const OrderScreen = ({ navigation }) => {
  const [quantity, setQuantity] = useState();
  const [quality, setquality] = useState();
  const [region, setRegion] = useState("");
  const [loadingDate, setLoadingDate] = useState(new Date());
  const [deliveryLocation, setDeliveryLocation] = useState("madhur");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          // Pre-fill delivery location with user's location if available
          if (parsedUser.location) {
            setDeliveryLocation(parsedUser.location);
          }
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        Alert.alert("Error", "Failed to load user data");
      }
    };

    getUserData();
  }, []);

  const quantities = ["12", "18", "25", "30"];
  const qualitys = {"Single Filter":0, "Double Filter":1, "Mixed Filter":2};
  const regions = [
    "Madhur",

    "Karepta",
    "Mandya",
    "Hollesphure",

    "Chamarajanagar",
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
      quality,
      region,
      loadingDate: loadingDate.toISOString(),
      userName: userData.userName,
      deliveryLocation: userData.location
    };

    try {
      console.log(orderData);
      const response = await axios.post(
        "https://agricult.onrender.com/new/order/",
        orderData
      );

      if (response.data.success) {
        Alert.alert("Success", "Order submitted! RFQ valid for 24 hours", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Failed to submit order. Please try again");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      Alert.alert(
        "Error",
        "Failed to submit order. Please check your connection"
      );
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
    <>
      <View style={styles.closeContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.rfqtext}>Create New RFQ</Text>
        </View>
        <Text style={styles.TonsText}>Quantity Required (Tons)</Text>
        <View style={styles.Tonscontainer}>
          <View style={styles.radioContainer}>
            {quantities.map((q) => (
              <TouchableOpacity
                key={q}
                style={[
                  styles.radioButton,
                  quantity === q && styles.selectedRadioButton,
                ]}
                onPress={() => setQuantity(q)}
              >
                <Text style={styles.radioText}>{`${q} tons`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={styles.TonsText}>Select Grade </Text>
        <View style={styles.Tonscontainer}>
        <View style={styles.radioContainer}>
          {Object.keys(qualitys).map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.radioButton,
                quality === qualitys[q] && styles.selectedRadioButton,
              ]}
              onPress={() => setquality(qualitys[q])} // Map quality to its assigned integer
            >
              <Text style={styles.radioText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>
        <Text style={styles.TonsText}> Region Required</Text>
        <View style={styles.Tonscontainer}>
          <View style={styles.radioContainer}>
            {regions.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.radioButton,
                  region === r && styles.selectedRadioButton,
                ]}
                onPress={() => setRegion(r)}
              >
                <Text style={styles.radioText}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.label}>Choose Loading Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {loadingDate.toLocaleDateString()}
          </Text>
          <Ionicons name="calendar-outline" size={24} color="#30534d" />
        </TouchableOpacity>
        {showDatePicker && (
          <RNDateTimePicker
            value={loadingDate}
            mode="date"
            onChange={(_event, date) => {
              setShowDatePicker(false);
              if (date) setLoadingDate(date);
            }}
          />
        )}
        <View style={styles.buttonsubmit}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  closeContainer: {
    position: "absolute",
    top: 10, // Adjust for desired vertical position
    right: 10, // Aligns the button to the right of the screen
    zIndex: 10, // Ensures it appears above other elements
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#95aba7",
    elevation: 3, // Adds shadow for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  qwerty: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  close: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
    backgroundColor: "#e6fffa",
    borderRadius: 50,
  },
  closeIcon: {
    color: "white",
  },
  buttonsubmit: {
    flexDirection: "row",

    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {},
  rfqtext: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a202c",
  },
  TonsText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3748",
    marginVertical: 10,
  },
  Tonscontainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",

    backgroundColor: "#fff",
  },
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows radio buttons to wrap to the next line
    // Adds space between radio buttons
    justifyContent: "flex-start", // Align items to the start of the row
  },

  radioButton: {
    borderWidth: 1,
    borderColor: "#38a169",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  selectedRadioButton: {
    backgroundColor: "#38a169",
  },
  radioText: {
    fontSize: 16,
    fontWeight: "bold",

    color: "#30534d",
    fontWeight: "600",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginVertical: 10,
  },
  dateButton: {
    flexDirection: "row",
    height: 50,
    width: 130,
    borderWidth: 1,
    borderColor: "#38a169",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  dateButtonText: {
    fontSize: 16,

    color: "#30534d",
  },
  submitButton: {
    marginRight: 10,
    width: "40%",
    backgroundColor: "#30534d",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButton: {
    marginRight: 10,
    width: "40%",
    backgroundColor: "#95aba7",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  userInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
  },
  userName: {
    fontSize: 14,
    color: "#718096",
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  cancelButtonText: {
    fontSize: 18,

    color: "black",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default OrderScreen;
