import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
    const navigation = useNavigation();
    const chatList = [
        { id: 1, name: 'Alice', profilePicture: 'https://via.placeholder.com/50/FF5733' },
        { id: 2, name: 'Bob', profilePicture: 'https://via.placeholder.com/50/33FF57' },
        { id: 3, name: 'Charlie', profilePicture: 'https://via.placeholder.com/50/3357FF' },
        { id: 4, name: 'David', profilePicture: 'https://via.placeholder.com/50/FF33A1' },
        { id: 5, name: 'Eva', profilePicture: 'https://via.placeholder.com/50/A133FF' },
        { id: 6, name: 'Frank', profilePicture: 'https://via.placeholder.com/50/FF8333' },
        { id: 7, name: 'Grace', profilePicture: 'https://via.placeholder.com/50/57FF33' },
        { id: 8, name: 'Alice', profilePicture: 'https://via.placeholder.com/50/FF5733' },
        { id: 9, name: 'Bob', profilePicture: 'https://via.placeholder.com/50/33FF57' },
        { id: 10, name: 'Charlie', profilePicture: 'https://via.placeholder.com/50/3357FF' },
        { id: 11, name: 'David', profilePicture: 'https://via.placeholder.com/50/FF33A1' },
        { id: 12, name: 'Eva', profilePicture: 'https://via.placeholder.com/50/A133FF' },
    ];

    const openChat = (chat) => {
        navigation.push('Chat', { chatId: chat.id });
    };

    const ChatListItem = ({ name, profilePicture, onPress }) => {
        return (
            <TouchableOpacity style={styles.chatListItem} onPress={onPress}>
                <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                <Text style={styles.chatListText}>{name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Scrollable Chat List */}
            <ScrollView>
                {chatList.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        name={chat.name}
                        profilePicture={chat.profilePicture}
                        onPress={() => openChat(chat)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECE5DD', 
    },
    header: {
        fontSize: 20,
        color: '#075E54',
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    chatListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF', 
        marginBottom: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1, 
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    chatListText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
});

export default ChatList;
