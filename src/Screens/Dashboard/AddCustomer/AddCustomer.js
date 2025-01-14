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
  ActivityIndicator, // Import ActivityIndicator for loader
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Snackbar from 'react-native-snackbar'; // Import react-native-snackbar
import Style from './Style';
import {WIFI} from '../../constants/constants';
import Geolocation from '@react-native-community/geolocation'; // Import geolocation

const AddCustomer = ({route}) => {
  const {driverId} = route.params;
  const [customerName, setCustomerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null); // Store location
  const [adminRoutes, setAdminRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [successAddedCustomer, setSuccessAddedCustomer] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for loader

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
        Snackbar.show({
          text: 'Failed to fetch current location',
          backgroundColor: 'red',
          duration: 2000,
        });
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        timeout: 30000,
        maximumAge: 10000,
      },
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
        Snackbar.show({
          text: 'Failed to fetch route options.',
          backgroundColor: 'red',
          duration: 2000,
        });
      }
    };

    fetchRoutes();
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

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        `http://${WIFI}/api/customers/to/${driverId}`,
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

      setIsLoading(false); // End loading

      if (data.success) {
        console.log('Customer Added ✅');
        setSuccessAddedCustomer(true);
        Snackbar.show({
          text: 'Customer Added Successfully!',
          backgroundColor: 'green',
          duration: 2000,
        });
        setTimeout(() => {
          setSuccessAddedCustomer(false);
          setCustomerName('');
          setMobileNo('');
          setAddress('');
          setEmail('');
          setSelectedRouteId(null);
          setLocation(null);
        }, 3000);
      } else {
        console.log('Customer not added ❌');
        setIsLoading(false); // End loading
        Snackbar.show({
          text: `Customer with ${email} already existed, try with a different Email Id.`,
          backgroundColor: 'red',
          duration: 3000,
        });
      }
    } catch (err) {
      console.log('Error adding customer from mobile:', err);
      setIsLoading(false); // End loading
      Snackbar.show({
        text: 'Something went wrong, please try again.',
        backgroundColor: 'red',
        duration: 3000,
      });
    }
  };

  const validateFields = () => {
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(customerName)) {
      Snackbar.show({
        text: 'Customer name can only contain alphabets and spaces.',
        backgroundColor: 'red',
        duration: 3000,
      });
      return false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobileNo)) {
      Snackbar.show({
        text: 'Mobile number must be 10 digits.',
        backgroundColor: 'red',
        duration: 3000,
      });
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      Snackbar.show({
        text: 'Please enter a valid email address.',
        backgroundColor: 'red',
        duration:3000,
      });
      return false;
    }

    if (!selectedRouteId) {
      Snackbar.show({
        text: 'Please select a route.',
        backgroundColor: 'red',
        duration: 3000,
      });
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
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={Style.buttonText}>Add Customer</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddCustomer;
