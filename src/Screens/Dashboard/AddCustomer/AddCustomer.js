import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Snackbar from 'react-native-snackbar';
import Geolocation from '@react-native-community/geolocation';
import Style from './Style';
import {WIFI, YOUR_GOOGLE_MAPS_API_KEY} from '../../constants/constants'; // Import your API key
import MapView, {Marker} from 'react-native-maps'; // Google Maps Component

const AddCustomer = ({route}) => {
  const {driverId} = route.params;
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNo: '',
    address: '',
    email: '',
    selectedRouteId: null,
  });
  const [location, setLocation] = useState(null);
  const [adminRoutes, setAdminRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocation = () => {
    console.log('Fetching location...');
    Geolocation.getCurrentPosition(
      position => {
        console.log('Location fetched:', position.coords);
        setLocation(position.coords);
      },
      error => {
        console.log('Error fetching location:', error);
        Snackbar.show({
          text: 'Failed to fetch current location',
          backgroundColor: 'red',
          duration: 2000,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // 30 seconds timeout for location fetching
        maximumAge: 10000,
      },
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      console.log('Fetching routes for driver ID:', driverId);
      try {
        const response = await fetch(`http://${WIFI}/api/route/${driverId}`);
        const data = await response.json();
        console.log('Routes fetched:', data);
        const routes = data?.customersByRoute?.[0]?.route
          ? [
              {
                id: data.customersByRoute[0].route._id,
                name: data.customersByRoute[0].route.name,
              },
            ]
          : [];
        setAdminRoutes(routes);
      } catch (error) {
        console.error('Error fetching routes:', error);
        Snackbar.show({
          text: 'Failed to fetch route options',
          backgroundColor: 'red',
          duration: 2000,
        });
      }
    };
    fetchRoutes();
  }, [driverId]);

  const handleChange = (field, value) =>
    setFormData(prevState => ({...prevState, [field]: value}));

  const validateFields = () => {
    const {customerName, mobileNo, email, selectedRouteId} = formData;
    if (!/^[A-Za-z\s]+$/.test(customerName)) {
      Snackbar.show({
        text: 'Customer name can only contain alphabets and spaces.',
        backgroundColor: 'red',
        duration: 3000,
      });
      return false;
    }
    if (!/^\d{10}$/.test(mobileNo)) {
      Snackbar.show({
        text: 'Mobile number must be 10 digits.',
        backgroundColor: 'red',
        duration: 3000,
      });
      return false;
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      Snackbar.show({
        text: 'Please enter a valid email address.',
        backgroundColor: 'red',
        duration: 3000,
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

  const handleSubmit = async () => {
    if (!validateFields()) return;
    const {customerName, mobileNo, address, email, selectedRouteId} = formData;
    const payload = {
      name: customerName,
      address,
      mobileNo,
      email,
      location: location ? `${location.latitude},${location.longitude}` : '',
      route: selectedRouteId,
    };

    console.log('Submitting customer data:', payload);
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://${WIFI}/api/customers/to/${driverId}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      setIsLoading(false);
      console.log('Customer submission response:', data);
      if (data.success) {
        Snackbar.show({
          text: 'Customer Added Successfully!',
          backgroundColor: 'green',
          duration: 2000,
        });
        setFormData({
          customerName: '',
          mobileNo: '',
          address: '',
          email: '',
          selectedRouteId: null,
        });
      } else {
        Snackbar.show({
          text: 'Customer with this email already exists.',
          backgroundColor: 'red',
          duration: 3000,
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Error submitting customer data:', err);
      Snackbar.show({
        text: 'Something went wrong. Please try again.',
        backgroundColor: 'red',
        duration: 3000,
      });
    }
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
              value={formData.customerName}
              onChangeText={text => handleChange('customerName', text)}
            />
            <TextInput
              style={Style.input}
              placeholder="Mobile No"
              value={formData.mobileNo}
              onChangeText={text => handleChange('mobileNo', text)}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              style={Style.input}
              placeholder="Address"
              value={formData.address}
              onChangeText={text => handleChange('address', text)}
            />
            <TextInput
              style={Style.input}
              placeholder="Email ID"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
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

            {/* Google Maps */}
            <View style={Style.mapContainer}>
              {location && (
                <MapView
                  style={Style.map}
                  region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  provider="google"
                  apiKey={YOUR_GOOGLE_MAPS_API_KEY} // Use your Google Maps API key here
                >
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title="Your Location"
                    description="Current Location"
                  />
                </MapView>
              )}
            </View>

            <Text style={Style.dropdownLabel}>Select Route:</Text>
            <View style={Style.pickerContainer}>
              <Picker
                selectedValue={formData.selectedRouteId}
                style={Style.picker}
                onValueChange={itemValue =>
                  handleChange('selectedRouteId', itemValue)
                }>
                <Picker.Item label="Select a route" value={null} />
                {adminRoutes.map(route => (
                  <Picker.Item
                    key={route.id}
                    label={route.name}
                    value={route.id}
                  />
                ))}
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
