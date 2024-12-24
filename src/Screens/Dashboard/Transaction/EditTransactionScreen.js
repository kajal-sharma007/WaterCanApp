import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-paper';

const EditTransactionScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Transaction</Text>

      <Card>
        <Card.Title title="Customer Details" />
        <Card.Content>
          <Text style={styles.customerDetails}>Customer: Customer A</Text>
          <Text style={styles.customerDetails}>
            Address: H Block South Delhi, India
          </Text>
          <Text style={styles.customerDetails}>Phone: 9876543219</Text>
          <Text style={styles.customerDetails}>Email: example@gmail.com</Text>
          <Text style={{marginBottom: 8}}>Last Delivered: -</Text>
          <Text style={styles.date}>Date: 24/12/2024</Text>
          <Text style={[styles.date, {marginVertical: 10}]}>
            Bottles Left: 5
          </Text>
        </Card.Content>
      </Card>

      <Text style={styles.left}>Select Product Type</Text>
      <TouchableOpacity style={styles.input}>
        <Text>Select product type</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Bottles Received:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Bottles Received"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Bottles Delivered:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Bottles Delivered"
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button title="Add Combo" onPress={() => {}} />
      </View>

      <View style={styles.chipsContainer}>
        <View style={styles.chip}>
          <Text>Product A</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Amount Received"
        keyboardType="numeric"
      />
      <Text>Price: 500</Text>
      <Text>Last Due Amount: 100</Text>
      <Text>Total Payable Amount: 600</Text>

      <View style={styles.buttonContainer}>
        <Button title="Order Delivered" color="green" onPress={() => {}} />
        <Button title="Cancel" color="red" onPress={() => {}} />
      </View>

      <View style={styles.processTxn}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Transaction processing.....</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  customerDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  left: {
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  processTxn: {
    backgroundColor: 'white',
    marginTop: 20,
    alignItems: 'center',
  },
});

export default EditTransactionScreen;
