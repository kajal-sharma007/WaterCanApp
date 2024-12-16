// screens/RouteScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

const Route = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Static list of routes
  const routes = [
    { label: 'Route 1', value: 'route1' },
    { label: 'Route 2', value: 'route2' },
    { label: 'Route 3', value: 'route3' }
  ];

  // Data for different routes
  const routeData = {
    route1: [
      { id: '1', title: 'Start', latitude: 26.9124, longitude: 75.7873 },
      { id: '2', title: 'Stop 1', latitude: 26.9144, longitude: 75.7893 },
      { id: '3', title: 'Stop 2', latitude: 26.9164, longitude: 75.7913 },
      { id: '4', title: 'End', latitude: 26.9184, longitude: 75.7933 }
    ],
    route2: [
      { id: '1', title: 'Start', latitude: 26.9124, longitude: 75.7853 },
      { id: '2', title: 'Stop 1', latitude: 26.9144, longitude: 75.7873 },
      { id: '3', title: 'Stop 2', latitude: 26.9164, longitude: 75.7893 },
      { id: '4', title: 'End', latitude: 26.9184, longitude: 75.7913 }
    ],
    route3: [
      { id: '1', title: 'Start', latitude: 26.9134, longitude: 75.7863 },
      { id: '2', title: 'Stop 1', latitude: 26.9154, longitude: 75.7883 },
      { id: '3', title: 'Stop 2', latitude: 26.9174, longitude: 75.7903 },
      { id: '4', title: 'End', latitude: 26.9194, longitude: 75.7923 }
    ]
  };

  // Handle route selection
  const handleRouteSelect = (value) => {
    setSelectedRoute(value);
  };

  // Get the selected route data
  const currentRouteData = selectedRoute ? routeData[selectedRoute] : [];

  // Ensure the map does not crash by providing fallback values
  const initialRegion = currentRouteData.length > 0 
    ? {
        latitude: currentRouteData[0]?.latitude || 26.9124,
        longitude: currentRouteData[0]?.longitude || 75.7873,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
    : {
        latitude: 26.9124,
        longitude: 75.7873,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedRoute}
          onValueChange={handleRouteSelect}
          style={styles.picker}
        >
          <Picker.Item label="Select a Route..." value={null} />
          {routes.map((route) => (
            <Picker.Item key={route.value} label={route.label} value={route.value} />
          ))}
        </Picker>
      </View>

      {selectedRoute && (
        <>
          <MapView
            style={{ flex: 1 }}
            initialRegion={initialRegion}
          >
            {currentRouteData.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              >
                <Text>{stop.title}</Text>
              </Marker>
            ))}
            <Polyline
              coordinates={currentRouteData.map((stop) => ({
                latitude: stop.latitude,
                longitude: stop.longitude
              }))}
              strokeColor="#000"
              strokeWidth={3}
            />
          </MapView>
        </>
      )}

      {!selectedRoute && (
        <View style={styles.staticMapContainer}>
          <Image
            source={{
              uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Jaipur&zoom=12&size=600x300&markers=color:red%7C26.9124,75.7873&key=YOUR_GOOGLE_MAPS_API_KEY'
            }}
            style={styles.staticMap}
          />
        </View>
      )}

      <View style={styles.listContainer}>
        <FlatList
          data={currentRouteData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        {selectedRoute && <Button title="Start Delivery" onPress={() => alert('Delivery started!')} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  staticMapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  staticMap: {
    width: '100%',
    height: 200,
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 10
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  }
});

export default Route;
