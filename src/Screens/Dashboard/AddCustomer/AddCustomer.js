import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Modal,
  StyleSheet,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Geolocation from '@react-native-community/geolocation';
import DropDownPicker from 'react-native-dropdown-picker'; // Improved dropdown
import Style from './Style';
import {WIFI} from '../../constants/constants'; // Import your API key
import {FlatList} from 'react-native';

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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({
    customerName: '',
    mobileNo: '',
    email: '',
    selectedRouteId: '',
  });

  // State for modal visibility and message
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
        enableHighAccuracy: false, // Reduced accuracy for faster fetching
        timeout: 10000, // 10 seconds timeout
        maximumAge: 5000, // 5 seconds maximum age to use cached location
      },
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

   useEffect(() => {
     const fetchRoutes = async () => {
       try {
         const response = await fetch(`http://${WIFI}/api/route/${driverId}`);
         const data = await response.json();
         const routes = data?.customersByRoute?.flatMap(item =>
           item.route
             ? {
                 id: item.route._id,
                 name: item.route.name,
               }
             : [],
         );

         setAdminRoutes(routes);

         setItems(
           routes.map(route => ({
             label: route.name,
             value: route.id,
           })),
         );
       } catch (error) {
         console.error('Error fetching routes:', error);
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
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      validationErrors.email = 'Please enter a valid email address.';
      isValid = false;
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
    if (!validateFields()) {return;}
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

        // Show success message in modal
        setModalMessage('Customer added successfully!');
        setModalVisible(true);
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

  const renderItem = ({item}) => {
    if (item.type === 'input') {
      return (
        <TextInput
          style={Style.input}
          placeholder={item.placeholder}
          value={formData[item.field]}
          onChangeText={text => handleChange(item.field, text)}
          keyboardType={item.keyboardType}
          maxLength={item.maxLength}
        />
      );
    }
    if (item.type === 'dropdown') {
      return (
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          containerStyle={{height: 50, width: '100%', marginTop: 10}}
          style={{
            borderColor: '#395bd5',
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: '#e3f2fd',
          }}
          dropDownStyle={{backgroundColor: '#7cdcfe'}}
          placeholder="Select a route"
          onChangeValue={itemValue =>
            handleChange('selectedRouteId', itemValue)
          }
        />
      );
    }
    if (item.type === 'location') {
      return location ? (
        <View style={Style.locationContainer}>
          <Text style={Style.locationText}>
            Current Location: Lat: {location.latitude.toFixed(4)} | Long:{' '}
            {location.longitude.toFixed(4)}
          </Text>
        </View>
      ) : (
        <View style={Style.locationContainer}>
          <Text style={Style.locationText}>Fetching current location...</Text>
        </View>
      );
    }
    return null;
  };

  const formItems = [
    {type: 'input', field: 'customerName', placeholder: 'Customer Name'},
    {
      type: 'input',
      field: 'mobileNo',
      placeholder: 'Mobile No',
      keyboardType: 'numeric',
      maxLength: 10,
    },
    {type: 'input', field: 'address', placeholder: 'Address'},
    {
      type: 'input',
      field: 'email',
      placeholder: 'Email ID',
      keyboardType: 'email-address',
    },
    {type: 'location'}, // Location item
    {type: 'dropdown'},
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1, padding: 20}}
          data={formItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <Text style={Style.title}>CUSTOMER INFORMATION</Text>
          )}
          ListFooterComponent={() => (
            <View style={Style.footer}>
              <TouchableOpacity style={Style.button1} onPress={handleSubmit}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={Style.buttonText}>Add Customer</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>

      {/* Modal for success message */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#395bd5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddCustomer;
