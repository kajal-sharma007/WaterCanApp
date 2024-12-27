import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 10,
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
  customerDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
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
    backgroundColor: '#3f6fe7',
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
});

export default styles;
