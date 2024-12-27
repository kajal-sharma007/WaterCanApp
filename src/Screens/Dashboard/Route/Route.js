import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {YOUR_GOOGLE_MAPS_API_KEY} from '../../constants/constants';
import imagePath from '../../constants/imagePath';
import GetLocation from 'react-native-get-location';
import {WIFI} from '../../constants/constants';


const Route = ({navigation, route}) => {
  const [state, setState] = useState({
    routes: [], // Store all routes data
    selectedRoute: null, // The currently selected route
    pickupCords: {
      latitude: 26.8947,
      longitude: 75.8301,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    selectedDropCords: [], // Drop points for selected route
    selectedDropIndex: null,
    selectedDropDetails: null,
    loading: true,
    error: null,
  });

  const mapRef = useRef(null);

  const {
    routes,
    selectedRoute,
    pickupCords,
    selectedDropCords,
    selectedDropIndex,
    selectedDropDetails,
  } = state;
    const { driverId } = route.params;
    
      useEffect(() => {
        console.log('Driver ID route :', driverId);
      }, [driverId]);

  // Fetch routes from the API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          `http://${WIFI}/api/route/${driverId}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch routes');
        }

        const data = await response.json();
        console.log('API Response:', data.customersByRoute[0].marker);

        if (data.customersByRoute && data.customersByRoute.length > 0) {
          setState(prevState => ({
            ...prevState,
            routes: data.customersByRoute, // Save routes data
            loading: false,
          }));
        } else {
          throw new Error('No route data found');
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message,
          loading: false,
        }));
      }
    };

    fetchRoutes();
  }, [driverId]);

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
      })
      .catch(error => {
        console.warn(error.code, error.message);
      });
  }, []);

  // Handle route selection
const handleRouteSelect = routeData => {
  // Map over markers to create dropCords
  const dropCords = routeData.marker.map(marker => {
    // Find the corresponding customer from customerArr by matching the id
    const customer = routeData.customerArr.find(cust => cust._id === marker.id);
    const userId = routeData.route;

    if (customer) {
      // If customer is found, return coordinates and customer details including bottlesLeft and dueAmt
      return {
        latitude: marker.coordinates.latitude,
        longitude: marker.coordinates.longitude,
        title: marker.title,
        id: marker.id,
        address: marker.details.address,
        phone: marker.details.phone,
        email: marker.details.email,
        bottlesLeft: customer.bottlesLeft, // Adding bottlesLeft from customerArr
        dueAmt: customer.dueAmt,           // Adding dueAmt from customerArr
        user: userId.user,
      };
    } else {
      // If no customer found, return null (can be filtered later)
      return null;
    }
  }).filter(Boolean); // Filter out null values in case of missing customers

  // Update state with the selected route and dropCords
  setState(prevState => ({
    ...prevState,
    selectedRoute: routeData,
    selectedDropCords: dropCords,
  }));

  // Debugging: Log the entire routeData and the dropCords array
  console.log("Route Data:", routeData);
  console.log("Drop Coordinates:", dropCords);

  // Close the dropdown
  setDropdownVisible(false);
};


  // Function to handle marker press
  const handleMarkerPress = index => {
    const selectedDrop = selectedDropCords[index];
    setState(prevState => ({
      ...prevState,
      selectedDropIndex: index,
      selectedDropDetails: selectedDrop,
    }));
    setModalVisible(true);
  };

  // Handle zoom to fit coordinates
  const zoomToFitRoute = coordinates => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, bottom: 50, left: 50, right: 50},
        animated: true,
      });
    }
  };

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {/* Dropdown trigger (TouchableOpacity) */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown visibility
        >
          <Text style={styles.dropdownText}>
            {selectedRoute ? selectedRoute.route.name : 'Select Route'}
          </Text>
        </TouchableOpacity>

        {/* Dropdown List - FlatList displayed on top of map */}
        {isDropdownVisible && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={routes}
              keyExtractor={item => item.route._id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.routeItem}
                  onPress={() => handleRouteSelect(item)} // Close dropdown after selection
                >
                  <Text style={styles.routeName}>{item.route.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Map View */}
        <MapView
          style={styles.mapContainer}
          initialRegion={{
            ...pickupCords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          ref={mapRef}>
          {/* Markers for pickup and drop locations */}
          <Marker
            coordinate={pickupCords}
            title="Pickup"
            image={imagePath.icBike} // Marker image for pickup
          />
          {selectedDropCords.map((drop, index) => (
            <Marker
              key={index}
              coordinate={drop}
              title={`Drop ${index + 1}`}
              image={imagePath.locationmarker} // Marker image for drop points
              onPress={() => handleMarkerPress(index)} // Handle marker press
            />
          ))}

          {/* Directions for selected drop */}
          {selectedDropIndex !== null && (
            <MapViewDirections
              origin={pickupCords}
              destination={selectedDropCords[selectedDropIndex]}
              apikey={YOUR_GOOGLE_MAPS_API_KEY}
              strokeColor="blue"
              strokeWidth={4}
              showsUserLocation={false}
              onReady={result => {
                zoomToFitRoute(result.coordinates); // Zoom map to fit route
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
                    navigation.navigate('EditTransactionScreen', {
                      customerDetails: selectedDropDetails, driverId
                    });
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
  mapContainer: {
    flex: 1, // Ensures the map takes full available height
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#009688',
    margin: 20,
    borderRadius: 5,
    zIndex: 2, // Ensures dropdown button is above the map
  },
  dropdownText: {
    color: 'white',
    fontSize: 18,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 80, // Adjust for where the button is
    left: 20,
    right: 20,
    backgroundColor: 'white',
    zIndex: 3, // Ensures dropdown is above the map
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  routeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
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
