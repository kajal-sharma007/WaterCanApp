import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { YOUR_GOOGLE_MAPS_API_KEY } from '../../constants/constants';
import imagePath from '../../constants/imagePath';
import GetLocation from 'react-native-get-location';
import { WIFI } from '../../constants/constants';

const Route = ({navigation}) => {
  const [state, setState] = useState({
    pickupCords: {
      latitude: 26.8947,
      longitude: 75.8301,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    dropCords: [
      {latitude: 26.8505, longitude: 75.7628},
      {latitude: 26.9124, longitude: 75.7873},
      {latitude: 26.1751, longitude: 75.0421},
      {latitude: 26.6139, longitude: 75.209},
      {latitude: 26.076, longitude: 75.8777},
      {latitude: 26.5726, longitude: 75.3639},
      {latitude: 26.7333, longitude: 75.7794},
      {latitude: 24.5698, longitude: 73.6955},
      {latitude: 24.5798, longitude: 73.6955},
    ],
    selectedDropIndex: null, // Track which drop point is selected
    loading: true, // Track loading state
    error: null, // Track error state
  });

  const mapRef = useRef(null); // Create a reference to the MapView

  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const {pickupCords, dropCords, selectedDropIndex} = state;

  // Fetch drop locations from the API
  useEffect(() => {
    const fetchDropLocations = async () => {
      try {
        const response = await fetch(`http://${WIFI}/api/route/${route.params.driverId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch drop locations');
        }

        const data = await response.json();
        console.log('API Response:', data.customersByRoute[0].marker); // Log the raw API response

        // Check if customersByRoute exists and contains customers
        if (data.customersByRoute && data.customersByRoute.length > 0) {
          const markers = data.customersByRoute[0].marker; // Extract the marker array
          // const markers = Array.isArray(data.customersByRoute.marker) ? data.customersByRoute.marker : [];
          
          // Transform the marker data into the format you need for dropCords
          const dropCords = markers.map(marker => ({
            latitude: marker.coordinates.latitude,
            longitude: marker.coordinates.longitude,
            title: marker.details.name,
            address: marker.details.address, // Add address information
            phone: marker.details.phone,
            email: marker.details.email,
          }));

          setState(prevState => ({
            ...prevState,
            dropCords: dropCords, // Set the drop coordinates to the state
            loading: false,
          }));
        } else {
          throw new Error('No customer data found');
        }
      } catch (error) {
        console.error('Error fetching drop locations:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message,
          loading: false,
        }));
      }
    };

    fetchDropLocations();
  }, [route.params.driverId]);

  // Get the current location of the user
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 10000,
    })
      .then(location => {
        setState(prevState => ({
          ...prevState,
          pickupCords: {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        }));
        console.log(location.latitude, location.longitude);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });

    // Validate coordinates on load
    if (
      !pickupCords ||
      !dropCords ||
      !pickupCords.latitude ||
      !pickupCords.longitude ||
      dropCords.some(point => !point.latitude || !point.longitude)
    ) {
      Alert.alert(
        'Invalid Coordinates',
        'Please ensure that the coordinates are correct.',
      );
      return;
    }
  }, [dropCords, pickupCords]);

  const handleError = error => {
    console.error('Error loading map or directions:', error);
    Alert.alert('Error', 'There was an issue loading the map or directions.');
  };

  // Function to handle the fitToCoordinates logic
  const zoomToFitRoute = coordinates => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
        animated: true,
      });
    }
  };

  const handleMarkerPress = index => {
    setState(prevState => ({
      ...prevState,
      selectedDropIndex: index,
    }));
    setModalVisible(true); // Show the modal when a marker is pressed
  };

  // Resize the marker images
  const resizeMarker = (source, width, height) => {
    const sourceImage = Image.resolveAssetSource(source);
    return {uri: sourceImage.uri, width, height};
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            ...pickupCords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          ref={mapRef}
        >
          {/* Markers for pickup and multiple drop locations */}
          <Marker
            coordinate={pickupCords}
            title="Pickup"
            image={resizeMarker(imagePath.icBike, 30, 30)} // Resized marker
          />
          {dropCords.map((drop, index) => (
            <Marker
              key={index}
              coordinate={drop}
              title={`Drop ${index + 1}`}
              image={resizeMarker(imagePath.locationmarker, 30, 30)} // Resized marker
              onPress={() => handleMarkerPress(index)} // Handle marker press
            />
          ))}

          {/* Directions with fitToCoordinates for auto zoom */}
          {selectedDropIndex !== null && (
            <MapViewDirections
              origin={pickupCords}
              destination={dropCords[selectedDropIndex]} // Only show route to the selected drop point
              apikey={YOUR_GOOGLE_MAPS_API_KEY}
              strokeColor="blue"
              strokeWidth={4}
              showsUserLocation={false}
              onReady={result => {
               
                // Zoom the map to fit the route
                zoomToFitRoute(result.coordinates); // Calling the zoomToFitRoute function
              }}
            />
          )}
        </MapView>
      </View>

      {/* Modal for Marker Interaction */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  Drop Location {selectedDropIndex + 1}
                </Text>
                <Button
                  title="Edit Transaction"
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('EditTransactionScreen'); // Navigate to EditTransactionScreen
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Route;
