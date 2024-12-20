import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Styles from './Styles';

const RouteDetails = ({ route }) => {
  const [routeDetails, setRouteDetails] = useState(null); // State to store the route details from API
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const navigation = useNavigation();
  const { driverId } = route.params;

  useEffect(() => {
    // Fetch route details from the API
    const fetchRouteDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.5:9000/api/getroute/${driverId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch route details'); 
        }
        const data = await response.json();
        setRouteDetails(data); // Save the data from the API
      } catch (error) {
        setError(error.message); // Set the error message if the fetch fails
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchRouteDetails(); // Call the function when the component mounts
  }, [driverId]); // Re-run the effect if the id changes

  // Show loading indicator while fetching
  if (loading) {
    return (
      <View style={Styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error message if any
  if (error) {
    return (
      <View style={Styles.container}>
        <Text style={Styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Route Details</Text>
      
      {/* Render details for each customer in the route */}
      {routeDetails && routeDetails.customers && routeDetails.customers.length > 0 ? (
        routeDetails.customers.map((customer, index) => (
          <View key={index} style={Styles.customerContainer}>
            <Text style={Styles.customerTitle}>Customer: {customer.name}</Text>
            <Text>Address: {customer.address}</Text>
            {/* Add more fields if needed */}
          </View>
        ))
      ) : (
        <Text>No customers found for this route</Text>
      )}

      {/* Display additional data from the API if available */}
      {routeDetails.additionalInfo && (
        <View style={Styles.detailsContainer}>
          <Text>Additional Info: {routeDetails.additionalInfo}</Text>
        </View>
      )}

      <TouchableOpacity style={Styles.button} onPress={() => navigation.goBack()}>
        <Text style={Styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RouteDetails;
