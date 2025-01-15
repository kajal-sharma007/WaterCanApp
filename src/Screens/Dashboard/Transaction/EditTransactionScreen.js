import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Linking,
} from 'react-native';
import {Card} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import {WIFI} from '../../constants/constants';
import styles from './styles';
import {ActivityIndicator} from 'react-native';
import Snackbar from 'react-native-snackbar'; // Importing Snackbar

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
  const [chips, setChips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [txnDetails, setTxnDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

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
          const dropdownItems = data.map(item => ({
            label: `${item.productName} - ${item.productPrice}`,
            value: item._id,
            price: item.productPrice,
          }));
          setItems(dropdownItems);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        Snackbar.show({
          text: `Error fetching products: ${err.message}`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        }); // Show error
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleAddChip = () => {
    if (value) {
      const selectedItem = products.find(item => item._id === value);
      setCombo([
        ...combo,
        {
          type: selectedItem.productName,
          bottlesDelivered,
          bottlesReceived,
        },
      ]);
      const totalPrice =
        parseFloat(currentPrice) * parseFloat(bottlesDelivered);
      const newDeliveredAmt = delieverdAmt + totalPrice;
      setChips([...chips, selectedItem.productName]);
      setDelieverdAmt(newDeliveredAmt);
      setValue(null);
      setCurrentPrice('');
    }
  };

 const handleSave = async () => {
   setShowTxnData(true);
   setIsLoading(true);

   // Validation for empty fields
   if (!productType || !bottlesReceived || !bottlesDelivered || !amountPaid) {
     Snackbar.show({
       text: 'Please fill in all fields.',
       duration: Snackbar.LENGTH_LONG,
       backgroundColor: 'red',
     });
     setIsLoading(false);
     return; // Stop execution if validation fails
   }

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

       const driverName = 'Driver Name'; // Replace with logic to fetch the actual driver's name

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

       const phoneNumber = customerDetails.phone;
       const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
         message,
       )}`;
       Linking.openURL(url).catch(err =>
         console.error('Error sending message via WhatsApp', err),
       );
     } else {
       console.error('Error while processing transaction');
       Snackbar.show({
         text: 'Error while processing transaction',
         duration: Snackbar.LENGTH_LONG,
         backgroundColor: 'red',
       });
     }

     if (responseData.success) {
       console.log('Due amount updated successfully');
       setAmountPaid(0);
       setDelieverdAmt(0);
       setBottlesDelivered('');
       setBottlesReceived('');
     } else {
       console.error('Error while updating due amount');
       Snackbar.show({
         text: 'Error while updating due amount',
         duration: Snackbar.LENGTH_LONG,
         backgroundColor: 'red',
       });
     }
   } catch (err) {
     console.error('Error while processing transaction:', err);
     Snackbar.show({
       text: `Error: ${err.message}`,
       duration: Snackbar.LENGTH_LONG,
       backgroundColor: 'red',
     });
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
    setValue(null);
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
            <FlatList
              data={[{key: 'formContent'}]}
              renderItem={() => (
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
                      </Text>
                    </Card.Content>
                  </Card>

                  <Text style={styles.label}>Select Product Type</Text>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Select product type"
                    containerStyle={{height: 40, marginBottom: 10}}
                    onChangeItem={item => {
                      setProductType(item.label);
                      setCurrentPrice(item.price);
                    }}
                  />

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
              )}
              keyExtractor={item => item.key}
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditTransactionScreen;
