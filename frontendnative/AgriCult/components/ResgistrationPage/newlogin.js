import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const validateInputs = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    return true;
  };

  const storeUserData = async (token, user) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user credentials');
    }
  };

  const handleLogin = async () => {
    try {
      if (!validateInputs()) return;

      setIsLoading(true);
      setError('');
      
      const response = await fetch(`https://00z67rj6-3000.inc1.devtunnels.ms/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        // Store the token and user type
        console.log(data)
        console.log(data.session.access_token, data.user);
        await storeUserData(data.session.access_token, data.user);
        

        Alert.alert(
          'Success',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (data.userType === 'buyer') {
                  navigation.replace('BuyerHomeScreen');
                } else {
                  navigation.replace('SellerHomeScreen');
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
      
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const openRoleSelectionModal = () => {
    setIsModalVisible(true);
  };

  const closeRoleSelectionModal = () => {
    setIsModalVisible(false);
  };

  const handleRoleSelection = (role) => {
    setIsModalVisible(false);
    if (role === 'Buyer') {
      navigation.navigate('BuyerRegistration');
    } else if (role === 'Seller') {
      navigation.navigate('SellerRegistration');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image 
          source={require('../../assets/logo.jpg')}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome to AgriCult!</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          mode="outlined"
          placeholder="Enter your email"
          placeholderTextColor="#888"
          activeOutlineColor="#1E7C57"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry={!isPasswordVisible}
          right={
            <TextInput.Icon
              icon={isPasswordVisible ? 'eye-off' : 'eye'}
              onPress={togglePasswordVisibility}
              forceTextInputFocus={false}
            />
          }
          mode="outlined"
          placeholder="Enter your password"
          placeholderTextColor="#888"
          activeOutlineColor="#1E7C57"
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#1E7C57" style={styles.loader} />
        ) : (
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            style={styles.button}
            labelStyle={styles.buttonText}
            disabled={isLoading}
          >
            Login
          </Button>
        )}

        <TouchableOpacity onPress={openRoleSelectionModal}>
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeRoleSelectionModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register as:</Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => handleRoleSelection('Seller')}
            >
              <Text style={styles.modalButtonText}>Seller</Text>
            </Pressable>

            <Pressable
              style={styles.modalButton}
              onPress={() => handleRoleSelection('Buyer')}
            >
              <Text style={styles.modalButtonText}>Buyer</Text>
            </Pressable>

            <Pressable
              style={styles.modalCancelButton}
              onPress={closeRoleSelectionModal}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  innerContainer: {
    width: '90%',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 20,
    borderRadius: 65,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#145A38',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  button: {
    width: '70%',
    borderRadius: 30,
    marginTop: 15,
    paddingVertical: 8,
    backgroundColor: '#1E7C57',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    color: '#1E7C57',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#145A38',
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1E7C57',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loader: {
    marginVertical: 15,
  },
});

export default NewLogin;