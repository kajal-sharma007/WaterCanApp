import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Button,
  StyleSheet,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {YOUR_GOOGLE_MAPS_API_KEY} from '../../constants/constants';
import imagePath from '../../constants/imagePath';
import GetLocation from 'react-native-get-location';
import {WIFI} from '../../constants/constants';
import RouteStyles from './Styles';
import RBSheet from 'react-native-raw-bottom-sheet'; // Bottom drawer library

const Route = ({navigation, route}) => {
  const [state, setState] = useState({
    routes: [],
    selectedRoute: null,
    pickupCords: {
      latitude: 26.8947,
      longitude: 75.8301,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    selectedDropCords: [],
    selectedDropDetails: null,
    loading: true,
    error: null,
    dropdownVisible: false,
    selectedDropIndex: null,
  });

  const mapRef = useRef(null);
  const refRBSheet = useRef(); // Reference for Bottom Drawer
  const {driverId} = route.params;

  // Fetch route data from API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`http://${WIFI}/api/route/${driverId}`);
        const data = await response.json();

        if (data.customersByRoute.length > 0) {
          setState(prevState => ({
            ...prevState,
            routes: data.customersByRoute,
            loading: false,
          }));
        } else {
          setState(prevState => ({
            ...prevState,
            error: 'No route data found',
            loading: false,
          }));
        }
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          error: error.message,
          loading: false,
        }));
      }
    };

    fetchRoutes();
  }, [driverId]);

  // Get current location of the user
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
            ...location,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        }));
      })
      .catch(console.warn);
  }, []);

  // Handle route selection (closes dropdown)
  const handleRouteSelect = routeData => {
    const dropCords = routeData.marker
      .map(marker => {
        const customer = routeData.customerArr.find(
          cust => cust._id === marker.id,
        );
        return customer
          ? {
              ...marker.coordinates,
              title: marker.title,
              details: marker.details,
            }
          : null;
      })
      .filter(Boolean);

    setState(prevState => ({
      ...prevState,
      selectedRoute: routeData,
      selectedDropCords: dropCords,
    }));

    // Close dropdown after selection
    setState(prevState => ({
      ...prevState,
      dropdownVisible: false,
    }));
  };

  // Handle marker selection (opens bottom sheet)
  const handleMarkerPress = index => {
    setState(prevState => ({
      ...prevState,
      selectedDropDetails: state.selectedDropCords[index],
      selectedDropIndex: index,
    }));

    // Open the bottom drawer
    refRBSheet.current.open();
  };

  const zoomToFitRoute = coordinates => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, bottom: 50, left: 50, right: 50},
        animated: true,
      });
    }
  };

  // Function to reset all selected locations
  const resetRoute = () => {
    setState(prevState => ({
      ...prevState,
      selectedRoute: null,
      selectedDropCords: [],
      selectedDropDetails: null,
      selectedDropIndex: null,
    }));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {/* Dropdown for selecting route */}
        <TouchableOpacity
          style={RouteStyles.dropdownButton}
          onPress={() =>
            setState(prevState => ({
              ...prevState,
              dropdownVisible: !prevState.dropdownVisible,
            }))
          }>
          <Text style={RouteStyles.dropdownText}>
            {state.selectedRoute
              ? state.selectedRoute.route.name
              : 'Select Route'}
          </Text>
        </TouchableOpacity>

        {/* Dropdown menu */}
        {state.dropdownVisible && (
          <View style={RouteStyles.dropdownContainer}>
            <FlatList
              data={state.routes}
              keyExtractor={item => item.route._id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={RouteStyles.routeItem}
                  onPress={() => handleRouteSelect(item)}>
                  <Text style={RouteStyles.routeName}>{item.route.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Map View */}
        <MapView
          style={RouteStyles.mapContainer}
          initialRegion={state.pickupCords}
          showsUserLocation={true}
          ref={mapRef}>
          <Marker
            coordinate={state.pickupCords}
            title="Pickup"
            image={imagePath.icBike}
          />
          {state.selectedDropCords.map((drop, index) => (
            <Marker
              key={index}
              coordinate={drop}
              title={drop.details?.name}
              image={imagePath.locationmarker}
              onPress={() => handleMarkerPress(index)}
            />
          ))}

          {state.selectedDropIndex !== null && (
            <MapViewDirections
              origin={state.pickupCords}
              destination={state.selectedDropCords[state.selectedDropIndex]}
              apikey={YOUR_GOOGLE_MAPS_API_KEY}
              strokeColor="blue"
              strokeWidth={4}
              showsUserLocation={false}
              onReady={result => zoomToFitRoute(result.coordinates)}
            />
          )}
        </MapView>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={resetRoute}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Drawer for showing marker details */}
      <RBSheet
        ref={refRBSheet}
        height={250} // Adjust height of the drawer as needed
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#141414', // Dark background, like Netflix
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.8,
            shadowRadius: 3,
            elevation: 5,
          },
        }}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Drop Location {state.selectedDropIndex + 1}
          </Text>
          <Text style={styles.modalText}>
            Name: {state.selectedDropDetails?.details.name}
          </Text>
          <Text style={styles.modalText}>
            Address: {state.selectedDropDetails?.details.address}
          </Text>
          <Text style={styles.modalText}>
            Phone: {state.selectedDropDetails?.details.phone}
          </Text>
          <Text style={styles.modalText}>
            Email: {state.selectedDropDetails?.details.email}
          </Text>
          <Button
            title="Edit Transaction"
            onPress={() => {
              refRBSheet.current.close();
              navigation.navigate('EditTransactionScreen', {
                customerDetails: state.selectedDropDetails?.details,
                driverId,
              });
            }}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align items to the left (start)
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left', // Align title text to the left
  },
  modalText: {
    fontSize: 14, // Smaller font size
    color: '#fff',
    marginVertical: 5,
    textAlign: 'left', // Align text to the left
  },
  resetButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 100, // Ensures button is above the map
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Route;
