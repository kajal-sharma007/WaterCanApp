import React, {useState, useEffect, useRef} from 'react';
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
import Snackbar from 'react-native-snackbar';

const CustomButton = ({title, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity
    style={[styles.button, {backgroundColor}]}
    onPress={onPress}>
    <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
  </TouchableOpacity>
);

const EditTransactionScreen = ({route, navigation}) => {
  const {customerDetails, driverId, userId} = route.params;
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
  const [dropdownPosition, setDropdownPosition] = useState({top: 0});
  const inputRef = useRef();
  const [lastTransactionDate, setLastTransactionDate] = useState(null);

  useEffect(() => {
    const fetchLastTransactionDate = async () => {
      try {
        const response = await fetch(
          `http://${WIFI}/api/transaction-history?userId=${customerDetails.userId}`,
        );
        const data = await response.json();

        if (
          data.success &&
          data.transactions &&
          Array.isArray(data.transactions) &&
          data.transactions.length > 0
        ) {
          const sortedTransactions = data.transactions.sort((a, b) => {
            const dateA = new Date(a.dateTime.split('/').reverse().join('-'));
            const dateB = new Date(b.dateTime.split('/').reverse().join('-'));
            return dateB - dateA; // Sort in descending order (most recent first)
          });
          const lastTransaction = sortedTransactions[0];
          const dateParts = lastTransaction.dateTime.split('/');
          let month = dateParts[0]; // MM
          let day = dateParts[1]; // DD
          const year = dateParts[2]; // YYYY
          if (parseInt(month) < 10) month = '0' + month;
          if (parseInt(day) < 10) day = '0' + day;

          const formattedDate = `${day}/${month}/${year}`;

          setLastTransactionDate(formattedDate);
        }
      } catch (err) {
        console.error('Error fetching transaction history for user:', err);
      }
    };
    fetchLastTransactionDate();
  }, [customerDetails.userId]); // Re-run effect when userId changes

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://${WIFI}/api/getAllProducts`);
        const data = await response.json();

        if (data && Array.isArray(data)) {
          const filteredProducts = data.filter(
            product => product.userId === userId,
          );
          setProducts(filteredProducts);
        } else {
          setProducts([]); // Set an empty array if the data is not in the expected format
          console.error('API response is not in the expected format:', data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        alert(`Error fetching products: ${err.message}`);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [userId]);

  const validateFields = () => {
    if (!amountPaid || isNaN(amountPaid) || parseFloat(amountPaid) < 0) {
      Snackbar.show({
        text: 'Please enter valid amount paid!',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    return true;
  };

  const handleToggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleSelectItem = item => {
    setSelectedItem(item.productName + ' - ' + item.productPrice);
    setCurrentPrice(parseFloat(item.productPrice));
    setIsDropdownOpen(false);
  };

  const handleAddChip = () => {
    if (selectedItem && bottlesDelivered && bottlesReceived) {
      setCombo([
        ...combo,
        {type: selectedItem, bottlesDelivered, bottlesReceived},
      ]);
      const totalPrice =
        parseFloat(currentPrice) * parseFloat(bottlesDelivered);
      setDelieverdAmt(delieverdAmt + totalPrice);
      setChips([...chips, selectedItem]);
      setSelectedItem('');
      setBottlesDelivered('');
      setBottlesReceived('');
    }
  };

  const handleSave = async () => {
    if (!validateFields()) return;

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
        combo,
        driverId,
        paymentTaken: amountPaid,
        dueAmount: newDueAmt,
        dateTime: new Date().toLocaleDateString(),
        productType,
      };

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
        setTxnDetails(txnData.transaction);
        setIsModalVisible(true);

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
        const url = `whatsapp://send?phone=${
          customerDetails.phone
        }&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(err =>
          console.error('Error sending message via WhatsApp', err),
        );
      }

      if (responseData.success) {
        setAmountPaid(0);
        setDelieverdAmt(0);
        setBottlesDelivered('');
        setBottlesReceived('');
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

  const handleInputLayout = event => {
    const {y} = event.nativeEvent.layout;
    setDropdownPosition({top: y + 45});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                        Driver: {driverId}
                      </Text>

                      {/* Display Last Transaction Date */}
                      <Text style={styles.customerDetails}>
                        Last Transaction Date:{' '}
                        {lastTransactionDate || 'No transaction history'}
                      </Text>
                    </Card.Content>
                  </Card>

                  <Text style={styles.label}>Select Product Type</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={handleToggleDropdown}
                    onLayout={handleInputLayout}>
                    <Text style={styles.dropdownText}>
                      {selectedItem || 'Select product type'}
                    </Text>
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View
                      style={[
                        styles.dropdownContainer,
                        {top: dropdownPosition.top},
                      ]}>
                      {products.length > 0 ? (
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
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditTransactionScreen;
