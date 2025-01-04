import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AudioChat from './audioChat';
import AudioMessage from './audioMessage';

const POLLING_INTERVAL = 3000;
const API_BASE_URL = 'https://agricult.onrender.com';

const ChatInterface = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollViewRef = useRef();
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  const currentUser = route.params?.currentUser || 'EL-DIABLO69';
  const receiverUser = route.params?.receiverUser || 'AMBANI';

  const dealInfo = {
    quantity: +' Tons',
    type: 'Double Filter',
    location: 'Delhi,Azadpur Mandi',
    quality: 'Chamnarajnagar Quality',
    loadingDate: '08 Jan'
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chats?senderUserName=${currentUser}&receiverUserName=${receiverUser}`
      );
      const data = await response.json();
      
      if (data.success) {
        setChats(data.chats);
        setError(null);
      } else {
        setError('Failed to fetch chats');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [currentUser, receiverUser]);


  useEffect(() => {
    if (isNearBottom && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chats]);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
    setIsNearBottom(isNearBottom);
  };
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/new/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderUserName: currentUser,
          receiverUserName: receiverUser,
          message: message.trim(),
          type: 0
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('');
        fetchChats();
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Network error while sending message');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image source={require('../../assets/profile.png')} style={styles.avatar} />
        <Text style={styles.headerTitle}>{receiverUser}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.dealCard}>
        <Text style={styles.dealTitle}>{dealInfo.quantity} | {dealInfo.type}</Text>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={16} color="white" />
          <Text style={styles.locationText}>{dealInfo.location}</Text>
        </View>
        <View style={styles.qualityBadge}>
          <Text style={styles.qualityText}>{dealInfo.quality}</Text>
        </View>
        <Text style={styles.loadingDate}>Loading Date: {dealInfo.loadingDate}</Text>
      </View> */}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {loading ? (
          <Text style={styles.statusText}>Loading messages...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          chats.map(chat => (
            <View key={chat.chatID} style={[
              styles.messageWrapper,
              chat.senderUserName === currentUser ? styles.currentUserMessage : styles.otherUserMessage
            ]}>
              {chat.senderUserName !== currentUser && (
                <Image source={require('../../assets/profile.png')} style={styles.messageAvatar} />
              )}
              {chat.type === 0 ? (
                <View style={[
                  styles.messageBubble,
                  chat.senderUserName === currentUser ? styles.currentUserBubble : styles.otherUserBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    chat.senderUserName === currentUser && styles.currentUserMessageText
                  ]}>{chat.message}</Text>
                  <Text style={styles.messageTime}>
                    {formatMessageDate(chat.created_at)}
                  </Text>
                </View>
              ) : (
                <AudioMessage 
                  url={chat.audioChat.audio} 
                  isCurrentUser={chat.senderUserName === currentUser} 
                />
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <AudioChat 
          onAudioSend={fetchChats}
          currentUser={currentUser}
          receiverUser={receiverUser}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}>
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  menuButton: {
    padding: 8,
  },
  dealCard: {
    backgroundColor: '#2B5741',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  dealTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: 'white',
    marginLeft: 4,
  },
  qualityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  qualityText: {
    color: 'white',
    fontSize: 12,
  },
  loadingDate: {
    color: 'white',
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  messageTime: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#075E54',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  currentUserBubble: {
    backgroundColor: '#075E54',
  },
  otherUserBubble: {
    backgroundColor: 'white',
  },
  currentUserMessageText: {
    color: 'white',
  },
  statusText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    padding: 16,
    color: 'red',
  },
  audioBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minWidth: 100,
    maxWidth: 200,
  },
  audioWaveform: {
    flex: 1,
    height: 30,
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
});

export default ChatInterface;