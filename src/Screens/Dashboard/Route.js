import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {YOUR_GOOGLE_MAPS_API_KEY} from '../constants/constants';
import imagePath from '../constants/imagePath';
import GetLocation from 'react-native-get-location';
import {getCurrentPosition} from 'react-native-geolocation-service';

const Route = () => {
  const [state, setState] = useState({
    pickupCords: {
      latitude: 26.8947,
      longitude: 75.8301,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    dropCords: [
      {
        latitude: 26.8505,
        longitude: 75.7628,
      },
      {
        latitude: 26.9124,
        longitude: 75.7873,
      },
      {
        latitude: 27.1751,
        longitude: 78.0421,
      },
      {
        latitude: 28.6139,
        longitude: 77.209,
      },
      {
        latitude: 19.076,
        longitude: 72.8777,
      },
      {
        latitude: 22.5726,
        longitude: 88.3639,
      },
      {
        latitude: 30.7333,
        longitude: 76.7794,
      },
      {
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        latitude: 21.1702,
        longitude: 72.8311,
      },
    ],
    selectedDropIndex: null, // Track which drop point is selected
  });

  const mapRef = useRef(null); // Create a reference to the MapView

  const {pickupCords, dropCords, selectedDropIndex} = state;

  useEffect(() => {
    // Get the current location of the user
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 10000,
    })
      .then(location => {
        // Update the pickupCords state with the current location
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
        const {code, message} = error;
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
  }, [dropCords, pickupCords]); // Empty dependency array ensures this runs once on component mount

  const handleError = error => {
    console.error('Error loading map or directions:', error);
    Alert.alert('Error', 'There was an issue loading the map or directions.');
  };

  // Function to handle the fitToCoordinates logic
  const zoomToFitRoute = coordinates => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, bottom: 50, left: 50, right: 50},
        animated: true,
      });
    }
  };

  const handleMarkerPress = index => {
    // Set the selected drop point index when a drop point is clicked
    setState(prevState => ({
      ...prevState,
      selectedDropIndex: index,
    }));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            ...pickupCords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          ref={mapRef} // Attach the ref to the MapView component
        >
          {/* Markers for pickup and multiple drop locations */}
          <Marker
            coordinate={pickupCords}
            title="Pickup"
            image={imagePath.icBike}
          />
          {dropCords.map((drop, index) => (
            <Marker
              key={index}
              coordinate={drop}
              title={`Drop ${index + 1}`}
              image={imagePath.locationmarker}
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
              onError={handleError}
              onReady={result => {
                console.log(
                  `Directions Ready for Drop ${selectedDropIndex + 1}`,
                  result,
                );
                // Zoom the map to fit the route
                zoomToFitRoute(result.coordinates); // Calling the zoomToFitRoute function
              }}
            />
          )}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inpuStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default Route;
