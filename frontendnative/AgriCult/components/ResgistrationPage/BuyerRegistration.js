import React, { useState } from 'react';
import axios from 'axios';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '../const';

const BuyerRegistration = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegister = () => {
    if (
      !username ||
      !fullName ||
      !email ||
      !phoneNumber ||
      !businessName ||
      !location ||
      !password ||
      !termsAccepted
    ) {
      Alert.alert('Error', 'Please fill in all required fields and accept the terms.');
      return;
    }

    const userData = {
      userName: username,
      fullName,
      email,
      password,
      phoneNumber,
      businessName,
      location,
    };

    axios
      .post('https://agricult.onrender.com/new/buyer', userData)
      .then((response) => {
        console.log('Success:', response.data);
        Alert.alert('Success', 'Registration successful! Please check your email for verification.');
        navigation.navigate('BuyerHomeScreen', { email, phoneNumber });
      })
      .catch((error) => {
        console.error('Error:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        Alert.alert('Error', errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Buyer Registration</Text>

        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Full Name */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Phone Number */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Business Name */}
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
        />

        {/* Location Dropdown */}
        <View style={styles.dropdown}>
          <Picker
            selectedValue={location}
            onValueChange={(itemValue) => setLocation(itemValue)}
          >
            <Picker.Item label="Select Location" value="" />
            <Picker.Item label="Chamarajanagar" value="Chamarajanagar" />
            <Picker.Item label="Madhur" value="Madhur" />
            <Picker.Item label="Karepta" value="Karepta" />
            <Picker.Item label="Mandya" value="Mandya" />
            <Picker.Item label="Hollesphure" value="Hollesphure" />
            <Picker.Item label="Polyachi" value="Polyachi" />
          </Picker>
        </View>

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

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

export default BuyerRegistration;