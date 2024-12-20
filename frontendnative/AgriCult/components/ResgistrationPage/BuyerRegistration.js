import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const BuyerRegistration = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleOTPVerification = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }
    // Simulate OTP sending logic
    Alert.alert('OTP Sent', `OTP has been sent to ${phoneNumber}`);
    // Navigate to OTPVerification screen with the phone number and userType (hardcoded to "buyer")
    navigation.navigate('OTPVerification', { phoneNumber, userType: 'buyer' });
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload logic
    Alert.alert('Upload Photo', 'Photo uploaded successfully.');
    setProfilePhoto('https://via.placeholder.com/100'); // Temporary placeholder image
  };

  const handleRegister = () => {
    if (
      !fullName ||
      !phoneNumber ||
      !businessName ||
      !location ||
      !password ||
      !termsAccepted
    ) {
      Alert.alert('Error', 'Please fill all required fields and accept terms.');
      return;
    }
    // Proceed to OTP Verification after registration details are validated
    handleOTPVerification();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Buyer Registration</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name (required)"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number (required)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Business Name (required)"
          value={businessName}
          onChangeText={setBusinessName}
        />

        <TextInput
          style={styles.input}
          placeholder="Location (required)"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (required)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Profile Photo (optional)</Text>
          <Button title="Upload Photo" onPress={handlePhotoUpload} />
          {profilePhoto && (
            <Image source={{ uri: profilePhoto }} style={styles.photoPreview} />
          )}
        </View>

        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            size={25}
            fillColor="#4caf50"
            unfillColor="#FFFFFF"
            text="I accept terms and policy"
            iconStyle={{ borderColor: '#4caf50' }}
            textStyle={{
              textDecorationLine: 'none',
              color: '#333',
            }}
            isChecked={termsAccepted}
            onPress={(isChecked) => setTermsAccepted(isChecked)}
          />
        </View>

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
    backgroundColor: '#e8f5e9',
  },
  form: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 20,
    textAlign: 'center',
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
  photoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50,
  },
  checkboxContainer: {
    marginBottom: 15,
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

export default BuyerRegistration;
