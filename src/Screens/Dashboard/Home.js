import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';

const Home = ({ navigation, route }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const { driverId } = route.params;

  useEffect(() => {
    console.log('Driver ID Home:', driverId); // Log the driverId to confirm it is valid
  }, [driverId]);

  useEffect(() => {
    // Fetch the routes for the given driverId
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://192.168.1.10:9000/api/route/${driverId}`);
        const data = await response.json();
        console.log("Fetched data:", data);  // Log the entire fetched data to inspect the structure

        if (response.ok) {
          // Process the data from response
          const routesData = data.customersByRoute.map(item => ({
            routeName: item.route.name,  // Route name
            customerName: item.customerArr.length > 0 ? item.customerArr[0]?.name : 'No customers',  // First customer name (fallback if empty)
            address: item.customerArr.length > 0 ? item.customerArr[0]?.address : 'No address available', // Customer address (fallback if empty)
            routeId: item.route._id,  // Route id for unique identification
            customerId: item.customerArr.length > 0 ? item.customerArr[0]?._id : null  // Customer id (use null if no customer)
          }));

          setRoutes(routesData);  // Set the formatted data for FlatList
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

  const handleTileClick = (route) => {
    setSelectedRoute(route);
    setModalVisible(true);
  };

  const renderRouteItem = ({ item }) => {
    console.log(item);  // Log each item to check the structure

    return (
      <TouchableOpacity style={styles.routeTile} onPress={() => handleTileClick(item)}>
        <Text style={styles.routeText}>{item.routeName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routes for Delivery</Text>

      {loading && <ActivityIndicator size="large" color="#20B2AA" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Display routes when data is loaded and no errors */}
      {!loading && !error && (
        <FlatList
          data={routes}
          renderItem={renderRouteItem}
          keyExtractor={(item) => item.routeId.toString()}  // Use routeId for unique key
          numColumns={2}
          contentContainerStyle={styles.routeList}
        />
      )}

      {/* Modal for displaying route details */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRoute && (
              <>
                <Text style={styles.modalTitle}>Route Details</Text>
                <Text>Route: {selectedRoute.routeName}</Text>
                <Text>Customer: {selectedRoute.customerName}</Text>
                <Text>Address: {selectedRoute.address}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  routeList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeTile: {
    backgroundColor: '#20B2AA',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
