import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  innerContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004751',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#b5e5fa',
    marginBottom: 20,
  },
  customerDetails: {
    fontSize: 16,
    marginBottom: 10,
    color: '#004751',
  },
  label: {
    fontSize: 16,
    color: '#004751',
    marginVertical: 10,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b5e5fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f0f8ff',
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#b5e5fa',
    borderRadius: 10,
    padding: 10,
    marginLeft: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    top: 80, // Adjusted for better positioning
    maxHeight: 200,
    overflow: 'scroll',
   
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownText: {
    color: '#000',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  chip: {
    backgroundColor: '#b5e5fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  processTxn: {
    backgroundColor: '#fff',
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 30,
  },

  // Custom Button Styles
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 25,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    height: 50,
    backgroundColor: '#395bd5',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Add Combo Button Styling
  addComboButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#395bd5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    width: '100%',
  },
  addComboButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#004751',
  },
  footer: {
    padding: 20,
    marginTop: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  tileContainer: {
    backgroundColor: '#eaf4ff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tileText: {
    fontSize: 16,
    color: '#004751',
    marginBottom: 5,
  },
});

export default styles;
