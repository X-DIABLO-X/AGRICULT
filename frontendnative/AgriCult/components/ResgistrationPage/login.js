import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { BASE_URL } from '../const';


const greenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',
    background: 'white',
    text: 'black',
  },
};

const Login = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!emailOrPhone || !password) {
      setError('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      //if (!validateInputs()) return;

      setIsLoading(true);
      setError('');
      console.log('Login clicked with:', emailOrPhone, password);
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailOrPhone, // The backend expects 'email'
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {

        Alert.alert(
          'Success',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (data.session.userType === 'buyer') {
                  navigation.replace('BuyerDashboard');
                } else {
                  navigation.replace('SellerDashboard');
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

  return (
    <PaperProvider theme={greenTheme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TextInput
            placeholder="Email or Phone Number"
            value={emailOrPhone}
            onChangeText={(text) => {
              setEmailOrPhone(text);
              setError('');
            }}
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry
            style={styles.input}
          />
          
          {isLoading ? (
            <ActivityIndicator size="large" color={greenTheme.colors.primary} />
          ) : (
            <Button
              title="Login"
              color={greenTheme.colors.primary}
              onPress={handleLogin}
              disabled={isLoading}
            />
          )}
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: greenTheme.colors.background,
  },
  formContainer: {
    width: '80%',
    backgroundColor: greenTheme.colors.background,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: greenTheme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: greenTheme.colors.background,
    color: greenTheme.colors.text,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
};

export default Login;