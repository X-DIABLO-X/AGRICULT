import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const OrderScreen = () => {
  const [quantity, setQuantity] = useState('12');
  const [qualityType, setQualityType] = useState('single');
  const [region, setRegion] = useState('');
  const [loadingDate, setLoadingDate] = useState(new Date());
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const quantities = ['12', '15', '18', '25', '30'];
  const regions = [
    'Chamarajanagar', 'Madhur', 'Karepta',
    'Mandya', 'Hollesphure', 'Polyachi'
  ];

  const radioButtons = [
    { id: '1', label: 'Single Filter', value: 'single', size: 15 },
    { id: '2', label: 'Double Filter', value: 'double', size: 15 },
    { id: '3', label: 'Mixed', value: 'mixed', size: 15 }
  ];

  const handleSubmit = () => {
    if (!region || !deliveryLocation) {
      Alert.alert('Error', 'Please fill all mandatory fields');
      return;
    }
    Alert.alert('Success', 'Order submitted! RFQ valid for 24 hours');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Quantity (tons)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={quantity}
          onValueChange={setQuantity}
          style={styles.picker}>
          {quantities.map(q => (
            <Picker.Item key={q} label={`${q} tons`} value={q} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Quality Type</Text>
      <View style={styles.radioGroupContainer}>
        <RadioGroup 
          radioButtons={radioButtons} 
          onPress={setQualityType}
          selectedId={qualityType}
          containerStyle={styles.radioGroup}
          flexDirection="row" // Display radio buttons in a row
        />
      </View>

      <Text style={styles.label}>Region *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={region}
          onValueChange={setRegion}
          style={styles.picker}>
          <Picker.Item label="Select Region" value="" />
          {regions.map(r => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Loading Date</Text>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>{loadingDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <RNDateTimePicker
            value={loadingDate}
            mode="date"
            onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setLoadingDate(date);
            }}
        />
      )}

      <Text style={styles.label}>Delivery Location *</Text>
      <TextInput
        style={styles.input}
        value={deliveryLocation}
        onChangeText={setDeliveryLocation}
        placeholder="Enter delivery location"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // Light gray background for a soft look
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333', // Dark text for contrast
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff', // White background for pickers
    paddingHorizontal: 10, // Add horizontal padding
  },
  picker: {
    height: 50, // Set appropriate height
    width: '100%', // Make sure it's full width to accommodate long text
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center', // Center the text inside
    paddingHorizontal: 10, // Padding to prevent text cut-off
  },
  radioGroupContainer: {
    marginBottom: 15,
    flexDirection: 'row', // Align radio buttons in a row
    justifyContent: 'space-around', // Space them evenly
  },
  radioGroup: {
    flexDirection: 'row', // Ensures horizontal alignment of radio buttons
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff', // White background for input
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff', // White background for date button
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745', // Green background for the submit button
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 5, // Add shadow for Android
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderScreen;
