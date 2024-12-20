import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const BuyerRegistration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    businessName: '',
    location: '',
    password: '',
    profilePhoto: null,
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleInputChange = (key, value) => {
    setFormData(prevState => ({ ...prevState, [key]: value }));
  };

  const handleOTPVerification = () => {
    if (!formData.phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }
    Alert.alert('OTP Sent', `OTP has been sent to ${formData.phoneNumber}`);
    navigation.navigate('OTPVerification', { phoneNumber: formData.phoneNumber, userType: 'buyer' });
  };

  const handlePhotoUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera roll permissions to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange('profilePhoto', result.assets[0].uri);
    }
  };

  const handleRegister = () => {
    const { fullName, phoneNumber, businessName, location, password, termsAccepted } = formData;
    if (!fullName || !phoneNumber || !businessName || !location || !password || !termsAccepted) {
      Alert.alert('Error', 'Please fill all required fields and accept terms.');
      return;
    }
    handleOTPVerification();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#e0f2f1', '#ffffff']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.form}>
              <Text style={styles.title}>Buyer Registration</Text>

              <InputField
                icon="user"
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
              />

              <InputField
                icon="phone"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                keyboardType="phone-pad"
              />

              <InputField
                icon="briefcase"
                placeholder="Business Name"
                value={formData.businessName}
                onChangeText={(text) => handleInputChange('businessName', text)}
              />

              <InputField
                icon="map-pin"
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
              />

              <InputField
                icon="lock"
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#388E3C" />
                  </TouchableOpacity>
                }
              />

              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>Profile Photo (Optional)</Text>
                <TouchableOpacity style={styles.photoButton} onPress={handlePhotoUpload}>
                  {formData.profilePhoto ? (
                    <Image source={{ uri: formData.profilePhoto }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Feather name="camera" size={40} color="#388E3C" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.checkboxContainer}>
                <BouncyCheckbox
                  size={25}
                  fillColor="#388E3C"
                  unfillColor="#FFFFFF"
                  text="I accept terms and policy"
                  iconStyle={{ borderColor: '#388E3C' }}
                  textStyle={styles.checkboxText}
                  isChecked={formData.termsAccepted}
                  onPress={(isChecked) => handleInputChange('termsAccepted', isChecked)}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const InputField = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, rightIcon }) => (
  <View style={styles.inputContainer}>
    <Feather name={icon} size={20} color="#388E3C" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="#666"
    />
    {rightIcon}
  </View>
);

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width > 500 ? 500 : '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#388E3C',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#333',
  },
  photoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
    color: '#333',
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f4f7',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#388E3C',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default BuyerRegistration;
