import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const PhoneStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 25,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 40,
  },
  inputContainer: {
    width: width * 0.85,
    paddingBottom: 10,
  },
  buttonContainer: {
    width: width * 0.85,
    paddingBottom: 10,
  },
  button: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    borderWidth: 0.5,
    justifyContent: 'center',
    borderColor: 'lightgrey',
    alignItems: 'center',
    marginVertical: 8,
  },
  greenButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#20B2AA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  greenButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 60,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  orText: {
    paddingHorizontal: 10,
    fontSize: 10,
    color: '#20B2AA',
  },
  floatingLabelContainer: {
    marginVertical: 8,
  },
  floatingLabel: {
    position: 'absolute',
    left: 10,
    color: '#20B2AA',
    fontSize: 12,
    marginTop: 15,
    marginLeft: 10,
  },
  input: {
    height: 70,
    borderColor: '#20B2AA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: 'transparent',
    marginTop: 8,
  },
});

export default PhoneStyle;
