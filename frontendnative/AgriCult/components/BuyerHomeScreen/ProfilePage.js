import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const ProfilePage = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>        
        <Image 
          style={styles.backgroundImage}
          source={{ uri: 'https://via.placeholder.com/600x200?text=Forest+Theme' }}
        />
        <View style={styles.profileContainer}>
          <Image 
            style={styles.profileImage}
            source={{ uri: 'https://via.placeholder.com/150' }}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.businessName}>ABC Enterprises</Text>
          <Text style={styles.location}>Location: Bangalore, India</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>        
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <Text style={styles.infoLabel}>Full Name:</Text>
        <Text style={styles.infoValue}>John Doe</Text>

        <Text style={styles.infoLabel}>Phone Number:</Text>
        <Text style={styles.infoValue}>+91 9876543210</Text>

        <Text style={styles.infoLabel}>Business Name:</Text>
        <Text style={styles.infoValue}>ABC Enterprises</Text>

        <Text style={styles.infoLabel}>Location:</Text>
        <Text style={styles.infoValue}>Bangalore, India</Text>

        <Text style={styles.infoLabel}>Profile Photo:</Text>
        <Text style={styles.infoValue}>Uploaded</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9', // Light forest green
  },
  header: {
    marginBottom: 20,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: '#81c784', // Medium forest green
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
    borderColor: '#c8e6c9', // Light green
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2e7d32', // Dark green
  },
  businessName: {
    fontSize: 18,
    color: '#4caf50', // Bright green
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#66bb6a', // Vibrant green
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#388e3c', // Dark forest green
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
    color: '#1b5e20', // Deep green
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