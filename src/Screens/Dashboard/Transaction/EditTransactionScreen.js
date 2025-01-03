import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Linking,
  Button,
} from 'react-native';
import {Card} from 'react-native-paper';
import {WIFI} from '../../constants/constants';
import styles from './styles';

const CustomButton = ({title, onPress, backgroundColor, textColor}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}]}
      onPress={onPress}>
      <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const EditTransactionScreen = ({route, navigation}) => {
  const {customerDetails, driverId} = route.params;

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [chips, setChips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [txnDetails, setTxnDetails] = useState({});

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
    setIsLoading(true);

    try {
      const newDueAmt =
        parseFloat(delieverdAmt) +
        parseFloat(customerDetails.customer.dueAmt) -
        parseFloat(amountPaid);
      setDueAmt(newDueAmt);

      const payload = {
        customerId: customerDetails.customer._id,
        combo: combo,
        driverId: driverId,
        paymentTaken: amountPaid,
        dueAmount: newDueAmt,
        dateTime: new Date().toLocaleDateString(),
        productType: productType,
      };
      console.log('payload:', payload);

      const response = await fetch(
        `http://${WIFI}/api/customers/${customerDetails.customer._id}/due-amount-update`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({newDueAmt}),
        },
      );
      const responseData = await response.json();

      const txnResponse = await fetch(
        `http://${WIFI}/api/transaction/${customerDetails.customer.userId}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        },
      );
      const txnData = await txnResponse.json();

      if (txnData.success) {
        console.log('Transaction Successful.');
        setTxnDetails(txnData.transaction);
        setIsModalVisible(true);

        // Assuming you can get the driver's name from driverId (change if necessary)
        const driverName = 'Driver Name'; // Replace this with logic to fetch the actual driver's name

        // Assuming bottlesReceived corresponds to the total bottles received for the transaction
        const message = `
*Transaction Successful:*

*Customer:* ${customerDetails.name}
*Amount Paid:* ${txnData.transaction.paymentTaken}
*Due Amount:* ${txnData.transaction.dueAmount}

*Products and Bottles:* 
${txnData.transaction.combo
  .map(
    item =>
      `- ${item.type} (Delivered: ${item.bottlesDelivered}, Received: ${bottlesReceived})`,
  )
  .join('\n')}

*Date:* ${txnData.transaction.dateTime}
`;

        // Send message via WhatsApp
        const phoneNumber = customerDetails.phone; // Use the customer's phone number
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
          message,
        )}`;

        // Open WhatsApp with the message
        Linking.openURL(url).catch(err =>
          console.error('Error sending message via WhatsApp', err),
        );
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
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  const resetFields = () => {
    setProductType('');
    setBottlesReceived('');
    setBottlesDelivered('');
    setCurrentPrice('');
    setCombo([]);
    setAmountPaid('');
    setDelieverdAmt(0);
    setDueAmt(customerDetails.dueAmt);
    setSelectedItem('');
    setChips([]);
  };

  const handleCancel = () => {
    resetFields();
    navigation.goBack();
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
                      <Text style={styles.customerDetails}>
                        Date: {new Date().toLocaleDateString()}
                      </Text>
                      <Text style={styles.customerDetails}>
                        Bottles Left: {customerDetails.customer.bottlesLeft}
                      </Text>
                      <Text style={styles.customerDetails}>
                        Driver: {driverId}{' '}
                        {/* Display the driver's name or ID here */}
                      </Text>
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
                      style={styles.addComboButton}
                      onPress={handleAddChip}>
                      <Text style={styles.addComboButtonText}>Add Combo</Text>
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

                  <View style={styles.tileContainer}>
                    <Text style={styles.tileText}>Price: {delieverdAmt}</Text>
                    <Text style={styles.tileText}>
                      Last Due Amount: {customerDetails.customer.dueAmt}
                    </Text>
                    <Text style={styles.tileText}>
                      Total Payable Amount:{' '}
                      {parseFloat(delieverdAmt) +
                        parseFloat(customerDetails.customer.dueAmt)}
                    </Text>
                    <Text style={styles.tileText}>
                      Current Due:{' '}
                      {parseFloat(delieverdAmt) +
                        parseFloat(customerDetails.customer.dueAmt) -
                        parseFloat(amountPaid)}
                    </Text>
                  </View>

                  <View style={styles.buttonContainer1}>
                    <CustomButton
                      title="Order Delivered"
                      onPress={handleSave}
                      backgroundColor="green"
                      textColor="white"
                    />
                    <CustomButton
                      title="Cancel"
                      onPress={handleCancel}
                      backgroundColor="red"
                      textColor="white"
                    />
                  </View>
                </View>
              ) : isLoading ? (
                <View style={styles.processTxn}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text>Transaction processing...</Text>
                </View>
              ) : (
                <Modal
                  visible={isModalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={closeModal}>
                  <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>
                        Transaction Successful
                      </Text>
                      <Text>Transaction Date: {txnDetails.dateTime}</Text>
                      <Text>Amount Paid: {txnDetails.paymentTaken}</Text>
                      <Text>Due Amount: {txnDetails.dueAmount}</Text>
                      <Text>Products:</Text>
                      {txnDetails.combo &&
                        txnDetails.combo.map((item, index) => (
                          <Text key={index}>
                            {item.type} (Delivered: {item.bottlesDelivered})
                          </Text>
                        ))}
                      <Button title="Close" onPress={closeModal} />
                    </View>
                  </View>
                </Modal>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditTransactionScreen;
