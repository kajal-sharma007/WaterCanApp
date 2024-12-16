import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import add from '../../assets/Svg/add-user.png';

const AddCustomer = ({ navigation }) => {
  // State variables to hold form data
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Function to handle form submission
  const handleSubmit = () => {
    if (!customerName || !phoneNumber || !address) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    // You would normally send this data to an API or handle it accordingly
    const customerData = {
      customerName,
      phoneNumber,
      address,
      additionalInfo,
    };

    // Example: Show the submitted data in the console
    console.log('Customer Data:', customerData);

    // If submission is successful, navigate back to the previous screen (for example)
    Alert.alert('Success', 'Customer added successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add New Customer</Text>

      {/* Customer Name */}
      <Text style={styles.label}>Customer Name *</Text>
      <TextInput
        style={styles.input}
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Enter customer name"
      />

      {/* Phone Number */}
      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
      />

      {/* Address */}
      <Text style={styles.label}>Address *</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
      />

      {/* Additional Info (Optional) */}
      <Text style={styles.label}>Additional Information (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        multiline
        numberOfLines={4}
        placeholder="Enter any additional information"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Image source={add} style={styles.Image} />
                <Text style={styles.buttonText}>Add Customer</Text>
              </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#20B2AA',
  },
  input: {
    height: 40,
    borderColor: '#20B2AA',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  Image:{
    width:20,
    height:20,
    marginRight:5
  }

});

export default AddCustomer;
