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
    { id: '1', label: 'Single Filter', value: 'single' },
    { id: '2', label: 'Double Filter', value: 'double' },
    { id: '3', label: 'Mixed', value: 'mixed' }
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
      <RadioGroup 
        radioButtons={radioButtons} 
        onPress={setQualityType}
        selectedId={qualityType}
        containerStyle={styles.radioGroup}
      />

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
        <Text>{loadingDate.toLocaleDateString()}</Text>
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
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  radioGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderScreen;