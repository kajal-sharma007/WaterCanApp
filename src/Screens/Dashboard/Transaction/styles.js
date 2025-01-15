import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 5,
  },
  innerContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#b5e5fa',
    color: '#000000',
  },
  customerDetails: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000000',
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#b5e5fa',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#b5e5fa',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#b5e5fa',
    position: 'absolute',
    zIndex: 1,
    top: 60,
    width: '100%',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dropdownText: {
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
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
    backgroundColor: 'white',
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 30,
  },

  // Custom Button Styles
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', // Ensures each button takes up 45% of the width
    height: 50, // Provides enough height for the button for better accessibility
    backgroundColor: '#395bd5', // Add a background color for the button
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow radius for iOS
  },
  buttonText: {
    fontSize: 16, // Larger text size for better readability
    color: '#fff', // White text color for contrast
    fontWeight: 'bold', // Bold text for better visibility
    paddingVertical: 5, // Vertical padding for spacing
  },

  // Add Combo Button Styling
  addComboButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#395bd5', // Same as the other buttons
    paddingVertical: 12, // Slightly larger vertical padding
    paddingHorizontal: 20, // Horizontal padding to make it wider
    borderRadius: 10, // Rounded corners
    marginBottom: 15,
    justifyContent: 'center',
    width: '100%',
  },
  addComboButtonText: {
    fontSize: 16, // Same size as other buttons for consistency
    color: '#fff', // White text color
    fontWeight: 'bold', // Bold text for better readability
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
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    padding: 20,
    marginTop: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  tileContainer: {
    backgroundColor: '#b5e5fa', // Light grey background for the tile
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow radius for iOS
  },
  tileText: {
    fontSize: 16,
    color: '#004751',
    marginBottom: 5,
  },
});

export default styles;
