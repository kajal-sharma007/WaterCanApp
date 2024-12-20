import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  rating: {
    fontSize: 16,
    color: '#fff',
  },
  details: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 5,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#15837d',
    fontWeight:'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#15837d',
    borderRadius: 20, // Border radius applied to the container
    overflow: 'hidden', // This ensures the border radius works
    backgroundColor: '#a2d9d4', // Background color for the picker container
    marginTop:10,
  },
  picker: {
    height: '100%', // Ensures the Picker takes up the full height of the container
    width: '100%',
  },
  footer: {
    padding: 20,
    marginTop: 50,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  Image: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#DC143C',
    textAlign: 'center',
    marginTop: 20,
  },
  cameraIcon: {
    position: 'relative',
    bottom: 60,
    left: 80,
    height:50,
    width:50
  },
});

export default Styles;