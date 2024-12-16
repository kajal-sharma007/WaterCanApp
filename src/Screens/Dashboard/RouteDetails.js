import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RouteDetails = ({ route }) => {
  const [routeDetails, setRouteDetails] = useState(null); // State to store the route details from API
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const navigation = useNavigation();
  const { driverId } = route.params;

  // Fetch route details when the component mounts or driverId changes
  useEffect(() => {
    console.log('Driver ID:', driverId); // Log driverId to ensure it's correct
    const fetchRouteDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.6:9000/api/getroute/${driverId}`);
        
        // Log response status and check for errors
        console.log('Response Status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch route details');
        }

        const data = await response.json();
        
        // Log the fetched data for debugging
        console.log('Fetched Data:', data);

        // Check if the data is valid or empty
        if (!data || Object.keys(data).length === 0) {
          throw new Error('No data found for the given driverId');
        }

        setRouteDetails(data); // Save the data from the API
      } catch (error) {
        console.log('Fetch error:', error); // Log the error message
        setError(error.message); // Set the error message if the fetch fails
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchRouteDetails(); // Call the function when the component mounts or driverId changes
  }, [driverId]); // Re-run the effect if the driverId changes

  // Show loading indicator while fetching
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error message if any
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Route Details</Text>
      <Text>Route: {routeDetails?.routeName || 'N/A'}</Text> {/* Displaying route name from API response */}
      <Text>Customer: {routeDetails?.customerName || 'N/A'}</Text> {/* Displaying customer name from API response */}
      <Text>Address: {routeDetails?.address || 'N/A'}</Text> {/* Displaying address from API response */}

      {/* Display additional data from the API if available */}
      {routeDetails && (
        <View style={styles.detailsContainer}>
          <Text>Additional Info: {routeDetails?.additionalInfo || 'No additional info'}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 15,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});

export default RouteDetails;
