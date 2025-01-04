import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet, Platform, Alert, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import * as FileSystem from 'expo-file-system';

const SUPABASE_URL = 'https://pojuqqnftsunpiutlyrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvanVxcW5mdHN1bnBpdXRseXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODAwOTIsImV4cCI6MjA1MDI1NjA5Mn0.0QASIiNcOib_pClL7XMi45_MoK3cMNjLbmvfhp982UQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MIN_RECORDING_DURATION = 1000; // Minimum 1 second recording

const AudioChat = ({ onAudioSend, currentUser, receiverUser }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const recordingStartTime = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    checkPermissions();
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      setPermissionGranted(permission.granted);
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please grant microphone permission to record audio.',
          [
            { text: 'OK', onPress: () => checkPermissions() }
          ]
        );
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
    }
  };

  const startRecording = async () => {
    if (!permissionGranted) {
      await checkPermissions();
      return;
    }

    try {
      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and start new recording
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      recordingStartTime.current = Date.now();

      // Start animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recording || !isRecording) return;

    try {
      const duration = Date.now() - recordingStartTime.current;
      
      if (duration < MIN_RECORDING_DURATION) {
        Alert.alert('Recording too short', 'Please hold to record for at least 1 second.');
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsRecording(false);
        return;
      }

      const uri = recording.getURI();
      await recording.stopAndUnloadAsync();
      
      if (uri) {
        await uploadAudio(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }

    // Reset states
    setRecording(null);
    setIsRecording(false);
    scaleAnim.setValue(1);
  };

  const uploadAudio = async (uri) => {
    try {
      const filename = `${Date.now()}_${currentUser}_audio.m4a`;
      const filePath = `audio/${filename}`;

      // Read the file
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to Uint8Array
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('audio')
        .upload(filePath, bytes, {
          contentType: 'audio/m4a',
          cacheControl: '3600',
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath);

      await sendAudioMessage(publicUrl);

    } catch (err) {
      console.error('Failed to upload audio:', err);
      Alert.alert('Error', 'Failed to upload audio message. Please try again.');
    }
  };
  const AudioMessage = ({ audioUrl }) => {
    return (
      <View style={styles.audioMessageContainer}>
        <AudioPlayer audioUrl={audioUrl} />
      </View>
    );
  };
  const sendAudioMessage = async (audioUrl) => {
    try {
      const response = await fetch('https://agricult.onrender.com/new/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderUserName: currentUser,
          receiverUserName: receiverUser,
          message: "No message",
          audioChat: {"audio": audioUrl},
          type: 1,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onAudioSend();
      } else {
        throw new Error('Failed to send audio message');
      }
    } catch (err) {
      console.error('Failed to send audio message:', err);
      Alert.alert('Error', 'Failed to send audio message. Please try again.');
    }
  };

  return (
    <Pressable
      onLongPress={startRecording}
      onPressOut={stopRecording}
      delayLongPress={200}
    >
      <Animated.View
        style={[
          styles.micButton,
          isRecording && styles.recording,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <MaterialIcons 
          name={isRecording ? "mic" : "mic-none"} 
          size={24} 
          color="white" 
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  micButton: {
    backgroundColor: '#075E54',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  recording: {
    backgroundColor: '#ff4444',
  },
});

export default AudioChat;