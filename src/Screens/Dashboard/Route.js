import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import MapView from 'react-native-maps';

const Route = () => {
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Here we can handle any side effects or initialization
    const checkMapPermissions = async () => {
      try {
        // Example of an asynchronous task that might fail (e.g., location permission)
        // For now, we simulate potential errors
        // You can add your own permission request logic if needed
        throw new Error('Failed to load the map.'); // Simulated error
      } catch (error) {
        setMapError(error.message);
        Alert.alert('Map Error', error.message);
      }
    };

    checkMapPermissions();
  }, []);

  if (mapError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {mapError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onError={e => {
          // Handle map error if one occurs during runtime
          setMapError('Failed to load the map. Please try again later.');
          Alert.alert(
            'Map Error',
            'Failed to load the map. Please try again later.',
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  errorText: {
    color: '#721c24',
    fontSize: 18,
  },
});

export default Route;
