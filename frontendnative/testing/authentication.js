// Google Authentication Testing Frontend for React Native
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { supabase } from '../utils/supabase';

export default function GoogleAuthTest() {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: 'YOUR_CLIENT_ID_FROM_GOOGLE_CONSOLE', // Replace with your Google Console Client ID
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });

        if (error) {
          console.error('Supabase Sign-In Error:', error.message);
        } else {
          console.log('User authenticated:', data);
        }
      } else {
        throw new Error('No ID token found!');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in operation is in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google Play Services not available or outdated.');
      } else {
        console.error('Error during sign-in:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Google Sign-In Test</Text>
      <GoogleSigninButton
        style={styles.signInButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signInButton: {
    width: 230,
    height: 48,
  },
});
