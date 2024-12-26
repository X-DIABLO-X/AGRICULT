import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const SellerRegistration = ({ navigation }) => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    // Fetch locations from buyer's API
    axios
      .get('https://example.com/api/buyer/locations') // Replace with actual API
      .then((response) => {
        setLocations(response.data.locations); // Assume API returns { locations: [...] }
        setLoadingLocations(false);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
        Alert.alert('Error', 'Failed to load locations.');
        setLoadingLocations(false);
      });
  }, []);

  const handleRegister = () => {
    if (
      !licenseNumber ||
      !phoneNumber ||
      !region ||
      !password ||
      !termsAccepted
    ) {
      Alert.alert('Error', 'Please fill all required fields and accept the terms.');
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    const userData = {
      userName: licenseNumber, // Assuming licenseNumber is the username
      license: licenseNumber,
      email,
      password,
      phoneNumber: parseInt(phoneNumber), // Convert to number
      region,
    };

    console.log('User data to send:', userData);

    axios
      .post('https://00z67rj6-3000.inc1.devtunnels.ms/new/seller', userData)
      .then((response) => {
        console.log('Success:', response.data);
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('SellerHomeScreen', { phoneNumber, userType: 'seller' });
      })
      .catch((error) => {
        console.error('Error:', error.response?.data || error.message);
        Alert.alert('Error', 'Registration failed. Please try again.');
      });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const handlePhotoUpload = () => {
    Alert.alert('Upload Photo', 'Photo uploaded successfully.');
    setProfilePhoto('https://via.placeholder.com/100'); // Temporary placeholder image
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Seller Registration</Text>

        {/* License Number */}
        <TextInput
          style={styles.input}
          placeholder="License Number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />

        {/* Phone Number */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Region Dropdown */}
        <View style={styles.dropdown}>
          {loadingLocations ? (
            <ActivityIndicator size="small" color="#1E7C57" />
          ) : (
            <Picker
              selectedValue={region}
              onValueChange={(itemValue) => setRegion(itemValue)}
            >
              <Picker.Item label="Select Region" value="" />
              {locations.map((location) => (
                <Picker.Item
                  key={location.id} // Replace with the unique key from API data
                  label={location.name}
                  value={location.name}
                />
              ))}
            </Picker>
          )}
        </View>

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={handlePhotoUpload}>
            <Text style={styles.photoLabel}>Upload Profile Photo</Text>
          </TouchableOpacity>
          {profilePhoto && (
            <Image source={{ uri: profilePhoto }} style={styles.photoPreview} />
          )}
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View
            style={[
              styles.checkbox,
              termsAccepted ? styles.checkboxChecked : null,
            ]}
          />
          <Text style={styles.checkboxLabel}>
            I accept the terms and conditions
          </Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  form: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#145A38',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    color: 'black',
    borderColor: '#EEE',
    borderWidth: 1,
    elevation: 2,
  },
  dropdown: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: '#EEE',
    borderWidth: 1,
    backgroundColor: '#F9FAFB',
    elevation: 2,
  },
  photoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 16,
    color: '#4caf50',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#1E7C57',
    borderColor: '#1E7C57',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1E7C57',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SellerRegistration;
