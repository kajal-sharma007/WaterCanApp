import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  success: {
    backgroundColor: '#22ca5d',
    marginTop: 50,
    width: '60%',
  },
  error: {
    backgroundColor: 'red',
    marginTop: 50,
    width: '60%',
  },
  successText: {
    padding: 10,
    color: 'white',
  },
  errorText: {
    padding: 10,
    color: 'white',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    color: '#395bd5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#395bd5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 5,
    width: '100%',
  },
  dropdownLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#395bd5',
    marginTop: 10,
  },
  picker: {
    height: 60,
    width: '100%',
    marginLeft: 5,
  },
  pickerContainer: {
    height: 60,
    width: '100%',
    borderWidth: 1,
    borderColor: '#15837d',
    borderRadius: 20, // Border radius applied to the container
    overflow: 'hidden', // This ensures the border radius works
    backgroundColor: '#a2d9d4',
    marginTop: 10,
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
    backgroundColor: '#395bd5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
    marginHorizontal: 70,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#395bd5',
  },
});

export default Styles;