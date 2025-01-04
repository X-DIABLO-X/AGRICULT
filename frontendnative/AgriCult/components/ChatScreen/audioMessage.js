import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

const WhatsAppAudioMessage = ({ url, isCurrentUser }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isResetting, setIsResetting] = useState(false); // Prevent flashing

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [url]);

  const loadSound = async () => {
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(sound);
      if (status.isLoaded) {
        setDuration(status.durationMillis);
        setPosition(0); // Reset position when loading a new sound
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      if (!isResetting) {
        setPosition(status.positionMillis);
      }
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        handlePlaybackFinished();
      }
    }
  };

  const handlePlaybackFinished = async () => {
    if (sound) {
      try {
        setIsResetting(true);
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setPosition(0); // Update UI after reset
        setIsPlaying(false);
        setIsResetting(false); // Allow normal updates
      } catch (error) {
        console.error('Error resetting playback:', error);
        setIsResetting(false);
      }
    }
  };

  const playPauseSound = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          if (status.positionMillis >= duration || status.didJustFinish) {
            // Reset before replaying
            setIsResetting(true);
            await sound.setPositionAsync(0);
            setPosition(0); // Prevent flash by updating UI immediately
            setIsResetting(false);
          }
          await sound.playAsync();
        }
      } catch (error) {
        console.error('Error toggling playback:', error);
      }
    }
  };

  const getMinutesSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      <TouchableOpacity onPress={playPauseSound} style={styles.playButton}>
        <MaterialIcons
          name={isPlaying ? 'pause' : 'play-arrow'}
          size={24}
          color={isCurrentUser ? 'white' : '#075E54'}
        />
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground} />
        <View
          style={[
            styles.progressBar,
            {
              width: `${(position / duration) * 100}%`,
            },
            isCurrentUser
              ? styles.currentUserProgressBar
              : styles.otherUserProgressBar,
          ]}
        />
      </View>
      <Text
        style={[
          styles.timer,
          isCurrentUser ? styles.currentUserText : styles.otherUserText,
        ]}
      >
        {getMinutesSeconds(position)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 8,
    width: 250,
  },
  currentUserContainer: {
    backgroundColor: '#075E54',
  },
  otherUserContainer: {
    backgroundColor: '#DCF8C6',
  },
  playButton: {
    marginRight: 8,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
  },
  currentUserProgressBar: {
    backgroundColor: '#DCF8C6',
  },
  otherUserProgressBar: {
    backgroundColor: '#075E54',
  },
  timer: {
    fontSize: 12,
    marginLeft: 8,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: '#075E54',
  },
});

export default WhatsAppAudioMessage;
