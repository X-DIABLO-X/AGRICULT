import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'https://agricult.onrender.com';

const ChatList = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        } else {
          console.error("No user data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getUserData();
  }, []);

  const currentUser = userData?.userName || 'EL-DIABLO69';

  const processChats = (chats) => {
    const conversations = new Map();

    chats.forEach(chat => {
      const otherUser = chat.senderUserName === currentUser ? 
        chat.receiverUserName : chat.senderUserName;

      if (!conversations.has(otherUser) || 
          new Date(chat.created_at) > new Date(conversations.get(otherUser).created_at)) {
        conversations.set(otherUser, {
          id: chat.chatID,
          name: otherUser,
          lastMessage: chat.message,
          time: chat.created_at,
          isAudio: chat.audioChat !== null,
          type: chat.type,
          isTyping: false
        });
      }
    });

    return Array.from(conversations.values());
  };

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/all/chats?username=${currentUser}`
      );
      const data = await response.json();
      if (data.success) {
        const processedChats = processChats(data.chats);
        setChatList(processedChats);
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

  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return '';
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatInterface', {
        currentUser: currentUser,
        receiverUser: item.name
      })}
    >
      <Image
        source={require('../../assets/profile.png')}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <View style={styles.topLine}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{formatMessageTime(item.time)}</Text>
        </View>
        <View style={styles.bottomLine}>
          <Text 
            style={[
              styles.lastMessage,
              item.isTyping && styles.typing
            ]}
            numberOfLines={1}
          >
            {item.isAudio ? '🎵 Audio message' : item.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchChats}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Messages</Text>
      </View>
      <FlatList
        data={chatList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={chatList.length === 0 && styles.emptyList}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No conversations yet</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'green',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white',
  },
  list: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E1E1',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  typing: {
    color: '#007AFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
  },
});

export default ChatList;
