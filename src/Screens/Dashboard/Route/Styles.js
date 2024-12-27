// RouteStyles.js
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const RouteStyles = StyleSheet.create({
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

export default RouteStyles;
