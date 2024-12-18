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
import {Text} from 'react-native-svg';
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
    dropCords: {
      latitude: 26.8505,
      longitude: 75.7628,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });

  const mapRef = useRef(null); // Create a reference to the MapView

  const {pickupCords, dropCords} = state;

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
      !dropCords.latitude ||
      !dropCords.longitude
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
          {/* Markers for pickup and drop locations */}
          <Marker
            coordinate={pickupCords}
            title="Pickup"
            image={imagePath.icCurLoc}
          />
          <Marker
            coordinate={dropCords}
            title="Drop"
            image={imagePath.icGreenMarker}
          />

          {/* Directions with fitToCoordinates for auto zoom */}
          <MapViewDirections
            origin={pickupCords}
            destination={dropCords}
            apikey={YOUR_GOOGLE_MAPS_API_KEY}
            strokeColor="blue"
            strokeWidth={4}
            showsUserLocation={false}
            onError={handleError}
            onReady={result => {
              console.log('Directions Ready', result);
              // Zoom the map to fit the route
              zoomToFitRoute(result.coordinates); // Calling the zoomToFitRoute function
            }}
          />
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
