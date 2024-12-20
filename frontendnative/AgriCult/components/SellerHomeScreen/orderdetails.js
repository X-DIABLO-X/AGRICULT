import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker'; // For Date Picker
import * as ImagePicker from 'expo-image-picker'; // For image picker
import { Picker } from '@react-native-picker/picker'; // For dropdown selection

const QuoteSubmissionForm = () => {
  const [quantity, setQuantity] = useState('');
  const [filterType, setFilterType] = useState('');
  const [location, setLocation] = useState('');
  const [loadingDate, setLoadingDate] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  
  // Request permissions for image picking
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
    });
    
    if (!result.cancelled) {
      setImages(result.assets);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    alert('Quote Submitted!');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View>
        {/* Quantity */}
        <Text>Quantity:</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter Quantity"
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        />

        {/* Filter Type */}
        <Text>Filter Type:</Text>
        <Picker
          selectedValue={filterType}
          onValueChange={(itemValue) => setFilterType(itemValue)}
          style={{ height: 50, borderWidth: 1, marginBottom: 10 }}
        >
          <Picker.Item label="Select Filter Type" value="" />
          <Picker.Item label="Filter Type 1" value="type1" />
          <Picker.Item label="Filter Type 2" value="type2" />
        </Picker>

        {/* Location */}
        <Text>Location:</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter Location"
          style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        />

        {/* Loading Date */}
        <Text>Loading Date:</Text>
        <DatePicker
          date={loadingDate}
          onDateChange={setLoadingDate}
          mode="date"
          placeholder="Select Date"
          format="YYYY-MM-DD"
          style={{ width: '100%', marginBottom: 10 }}
        />

        {/* Price Input */}
        <Text>Price:</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Enter Price"
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        />

        {/* Image Upload */}
        <Text>Upload Images (max 5):</Text>
        <Button title="Select Images" onPress={pickImages} />
        
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={{ width: 80, height: 80, marginRight: 10 }}
            />
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#007bff', padding: 10, alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: 'white' }}>Submit Quote</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default QuoteSubmissionForm;
