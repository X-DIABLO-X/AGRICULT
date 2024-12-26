import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const SellerRegistration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    userName: '',
    license: '',
    email: '',
    password: '',
    phoneNumber: '',
    region: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Fixed array of regions
  const regions = [
    "Karepta", "Hollesphure", "Chamarajanagar", "Mandya", "Polyachi", "Madhur"
  ];

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.userName || !formData.license || !formData.email || 
        !formData.password || !formData.phoneNumber || !formData.region) {
      Alert.alert('Error', 'All fields are required.');
      return false;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number (minimum 10 digits).');
      return false;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the terms and conditions.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('https://00z67rj6-3000.inc1.devtunnels.ms/new/seller', {
        userName: formData.userName.trim(),
        license: formData.license,
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        region: formData.region.trim()
      });
      console.log(response.data);
      if (response.data.success) {
        Alert.alert(
          'Success',
          'Registration successful! Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SellerHomeScreen', { 
                phoneNumber: formData.phoneNumber, 
                userType: 'seller' 
              })
            }
          ]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert('Upload Photo', 'Photo uploaded successfully.');
    setProfilePhoto('https://via.placeholder.com/100');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Seller Registration</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.userName}
          onChangeText={(value) => handleInputChange('userName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="License Number"
          value={formData.license}
          onChangeText={(value) => handleInputChange('license', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
          keyboardType="phone-pad"
        />

        <View style={styles.dropdown}>
          <Picker
            selectedValue={formData.region}
            onValueChange={(value) => handleInputChange('region', value)}
          >
            <Picker.Item label="Select Region" value="" />
            {regions.map((region) => (
              <Picker.Item key={region} label={region} value={region} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />

        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={handlePhotoUpload}>
            <Text style={styles.photoLabel}>Upload Profile Photo</Text>
          </TouchableOpacity>
          {profilePhoto && (
            <Image source={{ uri: profilePhoto }} style={styles.photoPreview} />
          )}
        </View>

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