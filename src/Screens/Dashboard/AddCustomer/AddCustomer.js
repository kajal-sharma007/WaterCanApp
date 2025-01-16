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
import Geolocation from '@react-native-community/geolocation';
import DropDownPicker from 'react-native-dropdown-picker';
import Style from './Style';
import {WIFI} from '../../constants/constants';
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
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
      },
      error => {
        console.log('Error fetching location:', error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5000,
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

  const handleChange = (field, value) => {
    if (field === 'email') {
      const validEmail = value
        .replace(/[^A-Za-z0-9@._-]/g, '')
        .replace(/@.*@/, '@');

      const validEmailWithPeriod = validEmail.replace(/^\.|\.{2,}/g, '');
      setFormData(prevState => ({...prevState, [field]: validEmailWithPeriod}));

      validateField(field, validEmailWithPeriod);
    } else if (field === 'mobileNo') {
      const validValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prevState => ({...prevState, [field]: validValue}));
    } else if (field === 'customerName') {
      const validValue = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prevState => ({...prevState, [field]: validValue}));
    } else {
      setFormData(prevState => ({...prevState, [field]: value}));
    }

    validateField(field, value);
  };

  const validateField = (field, value) => {
    let validationErrors = {...errors};
    switch (field) {
      case 'customerName':
        validationErrors.customerName =
          /^[A-Za-z\s]+$/.test(value) || value === ''
            ? ''
            : 'Customer name can only contain alphabets and spaces.';
        break;
      case 'mobileNo':
        validationErrors.mobileNo =
          /^\d{10}$/.test(value) || value === ''
            ? ''
            : 'Mobile number must be 10 digits.';
        break;
      case 'email':
        validationErrors.email =
          /^(?![_.])[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
            value,
          ) || value === ''
            ? ''
            : 'Please enter a valid email address .';
        break;
      case 'selectedRouteId':
        validationErrors.selectedRouteId = value
          ? ''
          : 'Please select a route.';
        break;
      default:
        break;
    }
    setErrors(validationErrors);
  };

  const validateFields = () => {
    const {customerName, mobileNo, email, selectedRouteId} = formData;
    let validationErrors = {};
    let isValid = true;

    if (!/^[A-Za-z\s]+$/.test(customerName)) {
      validationErrors.customerName =
        'Customer name can only contain alphabets and spaces.';
      isValid = false;
    }
    if (!/^\d{10}$/.test(mobileNo)) {
      validationErrors.mobileNo = 'Mobile number must be 10 digits.';
      isValid = false;
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      validationErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!selectedRouteId) {
      validationErrors.selectedRouteId = 'Please select a route.';
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
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
      if (data.success) {
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
        console.error('Customer with this email already exists.');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Error submitting customer data:', err);
    }
  };

  const renderItem = ({item}) => {
    if (item.type === 'input') {
      return (
        <View>
          <TextInput
            style={Style.input}
            placeholder={item.placeholder}
            value={formData[item.field]}
            onChangeText={text => handleChange(item.field, text)}
            keyboardType={item.keyboardType}
            maxLength={item.maxLength}
          />
          {errors[item.field] && (
            <Text style={Style.errorText}>{errors[item.field]}</Text>
          )}
        </View>
      );
    }
    if (item.type === 'dropdown') {
      return (
        <View>
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
          {errors.selectedRouteId && (
            <Text style={Style.errorText}>{errors.selectedRouteId}</Text>
          )}
        </View>
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
    {type: 'location'},
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
