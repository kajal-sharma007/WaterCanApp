import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Styles from './Styles';
import {WIFI} from '../../constants/constants';
import ChartComponet from './ChartComponet';

const Home = ({navigation, route}) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Use useMemo to memoize scale and opacity values
  const scale = useMemo(() => new Animated.Value(0), []);
  const opacity = useMemo(() => new Animated.Value(0), []);

  const {driverId} = route.params;

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://${WIFI}/api/route/${driverId}`);
        const data = await response.json();

        if (response.ok) {
          const routesData = data.customersByRoute.map(item => ({
            routeName: item.route.name,
            customerName: item.customerArr.length > 0 ? item.customerArr : [],
            address:
              item.customerArr.length > 0
                ? item.customerArr[0]?.address
                : 'No address available',
            routeId: item.route._id,
            customerId:
              item.customerArr.length > 0 ? item.customerArr[0]?._id : null,
          }));

          setRoutes(routesData);
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

  // Modal animation logic
  useEffect(() => {
    if (modalVisible) {
      // Animate modal appearance (scale + opacity)
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animation on close
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, opacity, scale]);

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
    <>
      <View style={Styles.container}>
        <Text style={Styles.title}>Routes for Delivery</Text>

        {loading && <ActivityIndicator size="large" color="#20B2AA" />}
        {error && <Text style={Styles.errorText}>{error}</Text>}

        {!loading && !error && (
          <FlatList
            data={routes}
            renderItem={renderRouteItem}
            keyExtractor={item => item.routeId.toString()}
            numColumns={2}
            contentContainerStyle={Styles.routeList}
          />
        )}

        {/* Modal for displaying route details */}
        <Modal
          transparent={true}
          animationType="none" // Disable the default animation
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={Styles.modalContainer}>
            <Animated.View
              style={[
                Styles.modalContent,
                {
                  transform: [{scale: scale}],
                  opacity: opacity,
                },
              ]}>
              {selectedRoute && (
                <>
                  <Text style={Styles.modalTitle}>Route Details</Text>
                  <Text>Route: {selectedRoute.routeName}</Text>
                  <Text>
                    {selectedRoute.customerName.length > 0
                      ? `${selectedRoute.customerName.length} customers`
                      : 'No customers'}
                  </Text>
                  <TouchableOpacity
                    style={Styles.closeButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={Styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </View>
        </Modal>
      </View>
      <View style={Styles.tableContainer}>
        <ChartComponet />
      </View>
    </>
  );
};

export default Home;
