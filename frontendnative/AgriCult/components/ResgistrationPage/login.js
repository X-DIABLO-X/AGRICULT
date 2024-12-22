import React, { useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, StatusBar } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

// Define the green theme
const greenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',
    background: 'white',
    text: 'black',
  },
};

// Rename the function to 'Login'
const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = () => {
    alert(`Logging in with: ${emailOrPhone}`);
    // Add login logic here (API call, validation, etc.)
  };

  return (
    <PaperProvider theme={greenTheme}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: greenTheme.colors.background }}>
        <StatusBar barStyle="dark-content" />

        {/* Login Form */}
        <View style={{ width: '80%', backgroundColor: greenTheme.colors.background, borderRadius: 10, padding: 20 }}>
          <Text style={{ fontSize: 24, color: greenTheme.colors.text, textAlign: 'center' }}>Login</Text>
          
          <TextInput
            label="Phone Number or Email"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            keyboardType="email-address"
            style={{ marginBottom: 20, backgroundColor: greenTheme.colors.background, color: greenTheme.colors.text }}
            theme={{ colors: { primary: greenTheme.colors.primary } }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ marginBottom: 20, backgroundColor: greenTheme.colors.background, color: greenTheme.colors.text }}
            theme={{ colors: { primary: greenTheme.colors.primary } }}
          />
          
          <Button title="Login" color="green" onPress={handleSubmit} />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Login;
