import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const OTPVerification = ({ route, navigation }) => {
  const { phoneNumber, userType } = route.params; // Get phone number and userType passed from the previous screen
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleVerifyOTP = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    setIsLoading(true); // Start loading

    // Simulate OTP verification (replace with actual API call)
    setTimeout(() => {
      // Example OTP verification logic
      if (otp === '123456') { // Replace '123456' with your OTP validation logic
        setIsLoading(false); // Stop loading
        Alert.alert('Success', 'OTP Verified Successfully!');
        setOtp(''); // Clear OTP input field

        // Navigate to the appropriate home screen based on user type
        if (userType === 'buyer') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'BuyerHomeScreen' }],
          }); // Replace with BuyerHomeScreen
        } else if (userType === 'seller') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SellerHomeScreen' }],
          }); // Replace with SellerHomeScreen
        }
      } else {
        setIsLoading(false); // Stop loading
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    }, 2000); // Simulate a delay (2 seconds)
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
        maxLength={6} // Limit OTP to 6 digits
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      {/* You can add an option to resend OTP if needed */}
      {!isLoading && (
        <TouchableOpacity onPress={() => Alert.alert('OTP Sent', `OTP has been sent to ${phoneNumber}`)}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      )}
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
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7', // Lighter green for disabled state
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default OTPVerification;
