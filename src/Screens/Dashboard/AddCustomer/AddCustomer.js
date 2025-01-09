import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Style from './Style';
import {WIFI} from '../../constants/constants';
import Geolocation from '@react-native-community/geolocation'; // Import geolocation

const AddCustomer = ({route}) => {
  const [customerName, setCustomerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null); // Store location
  const [adminOptions, setAdminOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminRoutes, setAdminRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [successAddedCustomer, setSuccessAddedCustomer] = useState(false);
  const [notifyErr, setNotifyErr] = useState(false);
  const {driverId} = route.params;

  useEffect(() => {
    console.log('Driver ID customer :', driverId);
  }, [driverId]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        console.log('Current location:', latitude, longitude);
      },
      error => {
        console.log('Error getting location:', error);
        Alert.alert('Error', 'Failed to fetch current location');
      },
      {enableHighAccuracy: true, distanceFilter: 10, timeout: 30000, maximumAge: 10000}
    );
  
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);
  

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`http://${WIFI}/api/route/${driverId}`);
        const data = await response.json();
        console.log('Fetched route:', data);

        if (data && data.customersByRoute && data.customersByRoute[0].route) {
          const route = data.customersByRoute[0].route;
          const routes = [
            {
              id: route._id,
              name: route.name,
            },
          ];
          setAdminRoutes(routes);
        } else {
          console.log('No routes found for this driverId');
          setAdminRoutes([]);
        }
      } catch (error) {
        console.error('Error fetching route options:', error);
        Alert.alert('Error', 'Failed to fetch route options: ' + error.message);
        setAdminRoutes([]);
      }
    };

    fetchRoutes();
  }, [driverId]);

  useEffect(() => {
    const fetchAdminOptions = async () => {
      try {
        const response = await fetch(
          `http://${WIFI}/api/get-all-admin-assigned/to/${driverId}`,
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch admin options, status: ${response.status}`,
          );
        }
        const data = await response.json();
        setAdminOptions(data.users);
      } catch (error) {
        console.error('Error fetching admin options:', error);
        Alert.alert('Error', 'Failed to fetch admin options: ' + error.message);
      }
    };

    fetchAdminOptions();
  }, [driverId]);

  const handleCustomerNameChange = text => {
    const namePattern = /^[A-Za-z\s]*$/; // Allow only alphabets and spaces
    if (namePattern.test(text)) {
      setCustomerName(text);
    }
  };

  const handleMobileNoChange = text => {
    const mobilePattern = /^[0-9]*$/; // Allow only numbers
    if (mobilePattern.test(text)) {
      setMobileNo(text);
    }
  };

  const handleEmailChange = text => {
    setEmail(text);
  };

  const handleSubmit = async () => {
    // Validate inputs before proceeding
    if (!validateFields()) {
      return;
    }

    const payload = {
      name: customerName,
      address: address,
      mobileNo: mobileNo,
      email: email,
      location: location ? `${location.latitude},${location.longitude}` : '',
      route: selectedRouteId,
    };

    console.log('Payload:', payload);

    try {
      const response = await fetch(
        `http://${WIFI}/api/customers/to/${selectedRouteId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        console.log('Customer Added ✅');
        setSuccessAddedCustomer(true);
        setTimeout(() => {
          setSuccessAddedCustomer(false);
          setCustomerName('');
          setMobileNo('');
          setAddress('');
          setEmail('');
          // setSelectedAdmin(null);
          setSelectedRouteId(null);
          setLocation(null);
        }, 3000);
      } else {
        console.log('Customer not added ❌');
        setNotifyErr(true);
        setTimeout(() => {
          setNotifyErr(false);
        }, 4000);
      }
    } catch (err) {
      console.log('Error adding customer from mobile:', err);
      setNotifyErr(true);
      setTimeout(() => {
        setNotifyErr(false);
      }, 4000);
    }
  };

  const validateFields = () => {
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(customerName)) {
      Alert.alert(
        'Invalid Customer Name',
        'Customer name can only contain alphabets and spaces.',
      );
      return false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobileNo)) {
      Alert.alert('Invalid Mobile No', 'Mobile number must be 10 digits.');
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    if (!selectedRouteId) {
      Alert.alert('Error', 'Please select a route.');
      return false;
    }

    return true;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={Style.container}>
            <Text style={Style.title}>CUSTOMER INFORMATION</Text>

            <TextInput
              style={Style.input}
              placeholder="Customer Name"
              value={customerName}
              onChangeText={handleCustomerNameChange}
            />
            <TextInput
              style={Style.input}
              placeholder="Mobile No"
              value={mobileNo}
              onChangeText={handleMobileNoChange}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              style={Style.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={Style.input}
              placeholder="Email ID"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
            />

            {location ? (
              <View style={Style.locationContainer}>
                <Text style={Style.locationText}>
                  Current Location: Lat: {location.latitude.toFixed(4)} | Long:{' '}
                  {location.longitude.toFixed(4)}
                </Text>
              </View>
            ) : (
              <Text style={Style.locationText}>
                Fetching current location...
              </Text>
            )}


            <Text style={Style.dropdownLabel}>Select Route:</Text>
            <View style={Style.pickerContainer}>
              <Picker
                selectedValue={selectedRouteId}
                style={Style.picker}
                onValueChange={itemValue => setSelectedRouteId(itemValue)}>
                <Picker.Item label="Select a route" value={null} />
                {Array.isArray(adminRoutes) && adminRoutes.length > 0 ? (
                  adminRoutes.map(route => (
                    <Picker.Item
                      key={route.id}
                      label={route.name}
                      value={route.id}
                    />
                  ))
                ) : (
                  <Picker.Item label="No routes available" value={null} />
                )}
              </Picker>
            </View>

            <View style={Style.footer}>
              <TouchableOpacity style={Style.button1} onPress={handleSubmit}>
                <Text style={Style.buttonText}>Add Customer</Text>
              </TouchableOpacity>
            </View>

            <Modal
              visible={successAddedCustomer}
              animationType="fade"
              transparent={true}
              onRequestClose={() => setSuccessAddedCustomer(false)}>
              <View style={Style.modalOverlay}>
                <View style={Style.modalContent}>
                  <Text style={Style.modalText}>
                    Customer Added Successfully!
                  </Text>
                </View>
              </View>
            </Modal>

            {notifyErr && (
              <View style={Style.error}>
                <Text style={Style.errorText}>
                  {`Customer with ${email} already existed, try with a different Email Id.`}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddCustomer;
