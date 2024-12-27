import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue != null) {
        const user = JSON.parse(jsonValue);
        setUserData(user);
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>        
        <Image 
          style={styles.backgroundImage}
          source={{ uri: 'https://media.istockphoto.com/id/1280856062/photo/variety-of-fresh-organic-vegetables-and-fruits-in-the-garden.jpg?s=612x612&w=0&k=20&c=KoF5Ue-g3wO3vXPgLw9e2Qzf498Yow7WGXMSCNz7O60=' }}
        />
        <View style={styles.profileContainer}>
        <Image 
  style={styles.profileImage}
  source={{ 
    uri: userData.pic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      }}
    />
          <Text style={styles.name}>{userData.fullName}</Text>
          <Text style={styles.businessName}>{userData.businessName}</Text>
          <Text style={styles.location}>Location: {userData.location}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>        
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <Text style={styles.infoLabel}>Full Name:</Text>
        <Text style={styles.infoValue}>{userData.fullName}</Text>

        <Text style={styles.infoLabel}>Username:</Text>
        <Text style={styles.infoValue}>{userData.userName}</Text>

        <Text style={styles.infoLabel}>Phone Number:</Text>
        <Text style={styles.infoValue}>{userData.phoneNumber}</Text>

        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{userData.email}</Text>

        <Text style={styles.infoLabel}>Business Name:</Text>
        <Text style={styles.infoValue}>{userData.businessName}</Text>

        <Text style={styles.infoLabel}>Location:</Text>
        <Text style={styles.infoValue}>{userData.location}</Text>

        <Text style={styles.infoLabel}>Member Since:</Text>
        <Text style={styles.infoValue}>
          {new Date(userData.created_at).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
  },
  header: {
    marginBottom: 20,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: '#81c784',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -75,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#c8e6c9',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2e7d32',
  },
  businessName: {
    fontSize: 18,
    color: '#4caf50',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#66bb6a',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1b5e20',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2e7d32',
  },
  infoValue: {
    fontSize: 16,
    color: '#4caf50',
    marginBottom: 5,
  },
});

export default ProfilePage;