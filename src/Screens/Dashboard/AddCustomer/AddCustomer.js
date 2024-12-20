import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import Style from './Style';

const AddCustomer = ({ route }) => {
  const [customerName, setCustomerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminRoutes, setAdminRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [successAddedCustomer, setSuccessAddedCustomer] = useState(false);
  const [notifyErr, setNotifyErr] = useState(false);
  const { driverId } = route.params;

  useEffect(() => {
    console.log('Driver ID customer :', driverId);
  }, [driverId]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`http://192.168.1.2:9000/api/route/${driverId}`);
        const data = await response.json();
        console.log("Fetched route:", data);

        if (data && data.customersByRoute && data.customersByRoute[0].route) {
          const route = data.customersByRoute[0].route;
          const routes = [{
            id: route._id, 
            name: route.name
          }];

          if (routes.length > 0) {
            setAdminRoutes(routes);
            console.log("Filtered Routes:", routes);
          } else {
            console.log("No routes found for this driverId");
            setAdminRoutes([]);
          }
        } else {
          console.error("Invalid structure in fetched data:", data);
          setAdminRoutes([]); 
        }
      } catch (error) {
        console.error("Error fetching route options:", error);
        Alert.alert('Error', 'Failed to fetch route options: ' + error.message);
        setAdminRoutes([]);
      }
    };

    fetchRoutes();
  }, [driverId]);

  useEffect(() => {
    const fetchAdminOptions = async () => {
      try {
        const response = await fetch(`http://192.168.1.2:9000/api/get-all-admin-assigned/to/${driverId}`);
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
  }, []);

  // Handle real-time validation for customer name (allow only alphabets and spaces)
  const handleCustomerNameChange = (text) => {
    const namePattern = /^[A-Za-z\s]*$/;  // Allow only alphabets and spaces
    if (namePattern.test(text)) {
      setCustomerName(text);
    }
  };

  // Handle real-time validation for mobile number (allow only numeric input)
  const handleMobileNoChange = (text) => {
    const mobilePattern = /^[0-9]*$/; // Allow only numbers
    if (mobilePattern.test(text)) {
      setMobileNo(text);
    }
  };

  // Handle email input, no real-time restriction, but we will validate on submit
  const handleEmailChange = (text) => {
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
      location: location ? `${location.coords.latitude},${location.coords.longitude}` : "",
      route: selectedRouteId,
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `http://192.168.1.2:9000/api/customers/to/${selectedAdmin}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        console.log("Customer Added ✅");
        setSuccessAddedCustomer(true);
        setTimeout(() => {
          setSuccessAddedCustomer(false);
          setCustomerName('');
          setMobileNo('');
          setAddress('');
          setEmail('');
          setSelectedAdmin(null);
          setSelectedRouteId(null);
          setLocation(null);
        }, 3000);
      } else {
        console.log("Customer not added ❌");
        setNotifyErr(true);
        setTimeout(() => {
          setNotifyErr(false);
        }, 4000);
      }
    } catch (err) {
      console.log("Error adding customer from mobile:", err);
      setNotifyErr(true);
      setTimeout(() => {
        setNotifyErr(false);
      }, 4000);
    }
  };

  // Validation function
  const validateFields = () => {
    // Customer Name: Only alphabets and spaces allowed
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(customerName)) {
      Alert.alert("Invalid Customer Name", "Customer name can only contain alphabets and spaces.");
      return false;
    }

    // Mobile No: Only numeric and 10 digits
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobileNo)) {
      Alert.alert("Invalid Mobile No", "Mobile number must be 10 digits.");
      return false;
    }

    // Email: Simple validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    if (!selectedRouteId || !selectedAdmin) {
      Alert.alert("Error", "Please select both a route and an admin.");
      return false;
    }

    return true;
  };

  return (
    <View style={Style.container}>
      <Text style={Style.title}>CUSTOMER INFORMATION</Text>
      <TextInput
        style={Style.input}
        placeholder="Customer Name"
        value={customerName}
        onChangeText={handleCustomerNameChange} // Handle change for customer name
      />
      <TextInput
        style={Style.input}
        placeholder="Mobile No"
        value={mobileNo}
        onChangeText={handleMobileNoChange} // Handle change for mobile number
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
        onChangeText={handleEmailChange} // Handle change for email
        keyboardType="email-address"
      />

      <Text style={Style.dropdownLabel}>Select Admin:</Text>
      <View style={Style.pickerContainer}>
        <Picker
          selectedValue={selectedAdmin}
          style={Style.picker}
          onValueChange={(item) => setSelectedAdmin(item)}
        >
          <Picker.Item label="Select admin" value={null} />
          {Array.isArray(adminOptions) && adminOptions.length > 0 ? (
            adminOptions.map((item) => (
              <Picker.Item
                key={item._id}
                label={item.name}
                value={item._id}
              />
            ))
          ) : (
            <Picker.Item label="No admin available" value={null} />
          )}
        </Picker>
      </View>

      <Text style={Style.dropdownLabel}>Select Route:</Text>
      <View style={Style.pickerContainer}>
        <Picker
          selectedValue={selectedRouteId}
          style={Style.picker}
          onValueChange={(itemValue) => setSelectedRouteId(itemValue)}
        >
          <Picker.Item label="Select a route" value={null} />
          {Array.isArray(adminRoutes) && adminRoutes.length > 0 ? (
            adminRoutes.map((route) => (
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
        onRequestClose={() => setSuccessAddedCustomer(false)}
      >
        <View style={Style.modalOverlay}>
          <View style={Style.modalContent}>
            <Text style={Style.modalText}>Customer Added Successfully!</Text>
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
  );
};

export default AddCustomer;
