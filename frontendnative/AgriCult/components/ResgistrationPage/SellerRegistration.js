import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const SellerRegistration = ({ navigation }) => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
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
    // Navigate to OTPVerification screen with the phone number and userType (hardcoded to "seller")
    navigation.navigate('OTPVerification', { phoneNumber, userType: 'seller' });
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload logic
    Alert.alert('Upload Photo', 'Photo uploaded successfully.');
    setProfilePhoto('https://via.placeholder.com/100'); // Temporary placeholder image
  };

  const handleRegister = () => {
    if (
      !licenseNumber ||
      !phoneNumber ||
      !region ||
      !password ||
      !termsAccepted
    ) {
      Alert.alert('Error', 'Please fill all required fields and accept terms.');
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Proceed to OTP Verification after registration details are validated
    handleOTPVerification();
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Seller Registration</Text>

        <TextInput
          style={styles.input}
          placeholder="License Number (required)"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
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
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Region (required)</Text>
          <Picker
            selectedValue={region}
            style={styles.picker}
            onValueChange={(itemValue) => setRegion(itemValue)}
          >
            <Picker.Item label="Select Region" value="" />
            <Picker.Item label="Region 1" value="region1" />
            <Picker.Item label="Region 2" value="region2" />
            <Picker.Item label="Region 3" value="region3" />
            {/* Add more regions as needed */}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Password Creation (required)"
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
    </ScrollView>
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
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    height: 40,
    borderColor: '#c8e6c9',
    borderWidth: 1,
    borderRadius: 5,
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

export default SellerRegistration;
