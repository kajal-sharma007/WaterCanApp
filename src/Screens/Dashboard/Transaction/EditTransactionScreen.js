import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Card} from 'react-native-paper';
import {WIFI} from '../../constants/constants';
import styles from './styles';

const EditTransactionScreen = ({route, closeModal}) => {
  const {customerDetails, driverId} = route.params; // Destructure both customerDetails and driverId

  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState('');
  const [bottlesReceived, setBottlesReceived] = useState('');
  const [bottlesDelivered, setBottlesDelivered] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [combo, setCombo] = useState([]);
  const [showTxnData, setShowTxnData] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');
  const [delieverdAmt, setDelieverdAmt] = useState(0);
  const [dueAmt, setDueAmt] = useState(customerDetails.dueAmt);
  const [bottleReturn, setBottleReturn] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [chips, setChips] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://${WIFI}/api/getAllProducts`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        alert(`Error fetching products: ${err.message}`);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectItem = item => {
    setSelectedItem(item.productName + ' - ' + item.productPrice);
    setCurrentPrice(parseFloat(item.productPrice));
    setIsDropdownOpen(false);
  };

  const handleAddChip = () => {
    if (selectedItem) {
      setCombo([
        ...combo,
        {
          type: selectedItem,
          bottlesDelivered,
          bottlesReceived,
        },
      ]);
      const totalPrice =
        parseFloat(currentPrice) * parseFloat(bottlesDelivered);
      const newDeliveredAmt = delieverdAmt + totalPrice;
      setChips([...chips, selectedItem]);
      setDelieverdAmt(newDeliveredAmt);
      setSelectedItem('');
    }
  };

  const handleSave = async () => {
    setShowTxnData(true);

    try {
      const newDueAmt =
        parseFloat(delieverdAmt) + parseFloat(dueAmt) - parseFloat(amountPaid);
      setDueAmt(newDueAmt);

      const payload = {
        customerId: customerDetails.id,
        combo: combo,
        paymentTaken: amountPaid,
        dueAmount: newDueAmt,
        dateTime: new Date().toLocaleDateString(),
        productType: productType,
      };

      const response = await fetch(
        `https://${WIFI}/api/customers/${customerDetails.id}/due-amount-update`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({newDueAmt}),
        },
      );
      const responseData = await response.json();

      const txnResponse = await fetch(
        `http://${WIFI}/api/transaction/${driverId}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        },
      );
      const txnData = await txnResponse.json();

      if (txnData.success) {
        console.log('Transaction Successful.');
        closeModal();
      } else {
        console.error('Error while processing transaction');
      }

      if (responseData.success) {
        console.log('Due amount updated successfully');
        setAmountPaid(0);
        setDelieverdAmt(0);
        setBottlesDelivered('');
        setBottlesReceived('');
      } else {
        console.error('Error while updating due amount');
      }
    } catch (err) {
      console.error('Error while processing transaction:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {!showTxnData ? (
                <View style={styles.formContainer}>
                  <Text style={styles.title}>Edit Transaction</Text>
                  <Card style={styles.card}>
                    <Card.Title title="Customer Details" />
                    <Card.Content>
                      <Text style={styles.customerDetails}>
                        Customer: {customerDetails.name}
                      </Text>
                      <Text style={styles.customerDetails}>
                        Address: {customerDetails.address}
                      </Text>
                      <Text style={styles.customerDetails}>
                        Phone: {customerDetails.phone}
                      </Text>
                      <Text style={styles.customerDetails}>
                        Email: {customerDetails.email}
                      </Text>
                      <Text>Date: {new Date().toLocaleDateString()}</Text>
                      <Text>Bottles Left: {customerDetails.bottlesLeft}</Text>
                    </Card.Content>
                  </Card>

                  <Text style={styles.label}>Select Product Type</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={handleToggleDropdown}>
                    <Text style={styles.dropdownText}>
                      {selectedItem || 'Select product type'}
                    </Text>
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View style={styles.dropdownContainer}>
                      {Array.isArray(products) && products.length > 0 ? (
                        products.map(item => (
                          <TouchableOpacity
                            key={item._id}
                            style={styles.dropdownItem}
                            onPress={() => handleSelectItem(item)}>
                            <Text>{`${item.productName} - ${item.productPrice}`}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text>No products available.</Text>
                      )}
                    </View>
                  )}

                  <Text style={styles.label}>Bottles Received:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Bottles Received"
                    value={bottlesReceived}
                    onChangeText={setBottlesReceived}
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Bottles Delivered:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Bottles Delivered"
                    value={bottlesDelivered}
                    onChangeText={setBottlesDelivered}
                    keyboardType="numeric"
                  />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={handleAddChip}>
                      <Text style={styles.buttonText}>Add Combo</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.chipsContainer}>
                    {chips.map((chip, index) => (
                      <View key={index} style={styles.chip}>
                        <Text>{chip}</Text>
                      </View>
                    ))}
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Amount Received"
                    value={amountPaid}
                    onChangeText={setAmountPaid}
                    keyboardType="numeric"
                  />

                  <Text>Price: {delieverdAmt}</Text>
                  <Text>Last Due Amount: {dueAmt}</Text>
                  <Text>
                    Total Payable Amount:{' '}
                    {parseFloat(delieverdAmt) + parseFloat(dueAmt)}
                  </Text>
                  <Text>
                    Current Due:{' '}
                    {parseFloat(delieverdAmt) +
                      parseFloat(dueAmt) -
                      parseFloat(amountPaid)}
                  </Text>

                  <View style={styles.buttonContainer}>
                    <Button
                      title="Order Delivered"
                      color="green"
                      onPress={handleSave}
                    />
                    <Button title="Cancel" color="red" onPress={closeModal} />
                  </View>
                </View>
              ) : (
                <View style={styles.processTxn}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text>Transaction processing...</Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditTransactionScreen;
