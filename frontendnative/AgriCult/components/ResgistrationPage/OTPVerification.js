import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const OTPVerification = ({ route, navigation }) => {
  const { phoneNumber } = route.params; // Get phone number passed from the previous screen
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    // Simulate OTP verification logic
    Alert.alert('Success', 'OTP Verified Successfully!');
    navigation.goBack(); // Navigate back after verification
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.info}>An OTP has been sent to {phoneNumber}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e8f5e9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#757575',
  },
  input: {
    height: 40,
    borderColor: '#c8e6c9',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f1f8e9',
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OTPVerification;
