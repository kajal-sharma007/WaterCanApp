import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Picker } from '@react-native-picker/picker';
import { WIFI } from "../constants/constants";


const AddCustomer = ({ route }) => {
  const [customerName, setCustomerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [adminRoutes, setAdminRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null); // Selected route ID
  const [successAddedCustomer, setSuccessAddedCustomer] = useState(false);
  const [notifyErr, setNotifyErr] = useState(false);
  const { driverId } = route.params;

  useEffect(() => {
    console.log('Driver ID customer :', driverId);
  }, [driverId]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`http://${WIFI}/api/route/${driverId}`);
        const data = await response.json();
        console.log("Fetched route:", data); // Log the full response to inspect the structure

        // Check if the fetched data contains the expected structure
        if (data && data.customersByRoute && data.customersByRoute[0].route) {
          // Extract the route object
          const route = data.customersByRoute[0].route;

          // Create an array with the route info
          const routes = [{
            id: route._id,  // Assuming the route object has an _id field
            name: route.name // Assuming the route object has a name field
          }];

          if (routes.length > 0) {
            setAdminRoutes(routes);
            console.log("Filtered Routes:", routes);
          } else {
            console.log("No routes found for this driverId");
            setAdminRoutes([]); // Ensure it's an empty array if no routes found
          }
        } else {
          console.error("Invalid structure in fetched data:", data);
          setAdminRoutes([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching route options:", error);
        Alert.alert('Error', 'Failed to fetch route options: ' + error.message);
        setAdminRoutes([]); // Fallback to an empty array in case of error
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

  const handleSubmit = async () => {
    if (!customerName || !mobileNo || !address || !email || !selectedRouteId) {
      Alert.alert("Error", "Please fill in all fields.");
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

    console.log("Payload:", payload); // Log the payload to ensure it's correctly populated

    try {
      const response = await fetch(
        `http://${WIFI}/api/customers/to/${selectedAdmin}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);  // Log the response to inspect the result

      if (data.success) {
        console.log("Customer Added ✅");
        setSuccessAddedCustomer(true);
        setTimeout(() => {
          setSuccessAddedCustomer(false);
          // Reset all fields to initial values
          setCustomerName('');
          setMobileNo('');
          setAddress('');
          setEmail('');
          setSelectedAdmin(null);
          setSelectedRouteId(null);
          setLocation(null); // If you need to reset location as well
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

  return (
   <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Text style={styles.title}>CUSTOMER INFORMATION</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile No"
              value={mobileNo}
              onChangeText={setMobileNo}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Email ID"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
  
            <Text style={styles.dropdownLabel}>Select Admin:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAdmin}
                style={styles.picker}
                onValueChange={(item) => setSelectedAdmin(item)}
              >
                <Picker.Item label="Select admin" value={null} />
                {Array.isArray(adminOptions) && adminOptions.length > 0 ? (
                  adminOptions.map((item) => (
                    <Picker.Item key={item._id} label={item.name} value={item._id} />
                  ))
                ) : (
                  <Picker.Item label="No admin available" value={null} />
                )}
              </Picker>
            </View>
  
            <Text style={styles.dropdownLabel}>Select Route:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedRouteId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedRouteId(itemValue)}
              >
                <Picker.Item label="Select a route" value={null} />
                {Array.isArray(adminRoutes) && adminRoutes.length > 0 ? (
                  adminRoutes.map((route) => (
                    <Picker.Item key={route.id} label={route.name} value={route.id} />
                  ))
                ) : (
                  <Picker.Item label="No routes available" value={null} />
                )}
              </Picker>
            </View>
  
            <View style={styles.footer}>
              <TouchableOpacity style={styles.button1} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add Customer</Text>
              </TouchableOpacity>
            </View>
  
            {/* Success Modal */}
            <Modal
              visible={successAddedCustomer}
              animationType="fade"
              transparent={true}
              onRequestClose={() => setSuccessAddedCustomer(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>Customer Added Successfully!</Text>
                </View>
              </View>
            </Modal>
  
            {notifyErr && (
              <View style={styles.error}>
                <Text style={styles.errorText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  success: {
    backgroundColor: "#22ca5d",
    marginTop: 50,
    width: "60%",
  },
  error: {
    backgroundColor: "red",
    marginTop: 50,
    width: "60%",
  },
  successText: {
    padding: 10,
    color: "white",
  },
  errorText: {
    padding: 10,
    color: "white",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop:30,
    color:'#20B2AA'
  },
  input: {
    borderWidth: 1,
    borderColor: "#20B2AA",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 5,
    width: "100%",
  },
  dropdownLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#20B2AA',
    marginTop:10
  },
  picker: {
    height: 60,
    width: '100%',
    marginLeft:5
  },
  pickerContainer: {
    height: 60,
    width:'100%',
    borderWidth: 1,
    borderColor: '#15837d',
    borderRadius: 20, // Border radius applied to the container
    overflow: 'hidden', // This ensures the border radius works
    backgroundColor: '#a2d9d4',
    marginTop:10
  },
  footer: {
    padding: 20,
    marginTop: 50,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    width:'100%'
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginVertical:5,
    marginHorizontal:70
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#20B2AA",
  },
});

export default AddCustomer;
