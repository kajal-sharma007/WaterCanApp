import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Styles from './Styles';
import {WIFI} from '../../constants/constants';

const Home = ({navigation, route}) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const {driverId} = route.params;

  useEffect(() => {
    // Fetch the routes for the given driverId
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://${WIFI}/api/route/${driverId}`);
        const data = await response.json();
       

        if (response.ok) {
          // Process the data from response
          const routesData = data.customersByRoute.map(item => ({
            routeName: item.route.name, // Route name
            customerName: item.customerArr.length > 0 ? item.customerArr : [], // First customer name (fallback if empty)
            address:
              item.customerArr.length > 0
                ? item.customerArr[0]?.address
                : 'No address available', // Customer address (fallback if empty)
            routeId: item.route._id, // Route id for unique identification
            customerId:
              item.customerArr.length > 0 ? item.customerArr[0]?._id : null, // Customer id (use null if no customer)
          }));

          setRoutes(routesData); // Set the formatted data for FlatList
        } else {
          throw new Error('Failed to load routes');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [driverId]);

  const handleTileClick = route => {
    setSelectedRoute(route);
    setModalVisible(true);
  };

  const renderRouteItem = ({item}) => {
    

    return (
      <TouchableOpacity
        style={Styles.routeTile}
        onPress={() => handleTileClick(item)}>
        <Text style={Styles.routeText}>{item.routeName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Routes for Delivery</Text>

      {loading && <ActivityIndicator size="large" color="#20B2AA" />}
      {error && <Text style={Styles.errorText}>{error}</Text>}

      {/* Display routes when data is loaded and no errors */}
      {!loading && !error && (
        <FlatList
          data={routes}
          renderItem={renderRouteItem}
          keyExtractor={item => item.routeId.toString()} // Use routeId for unique key
          numColumns={2}
          contentContainerStyle={Styles.routeList}
        />
      )}

      {/* Modal for displaying route details */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={Styles.modalContainer}>
          <View style={Styles.modalContent}>
            {selectedRoute && (
              <>
                <Text style={Styles.modalTitle}>Route Details</Text>
                <Text>Route: {selectedRoute.routeName}</Text>
                <Text>
                  {selectedRoute.customerName.length > 0
                    ? `${selectedRoute.customerName.length} customers`
                    : 'No customers'}
                </Text>
                {/* <Text>Address: {selectedRoute.address}</Text> */}
                <TouchableOpacity
                  style={Styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={Styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
