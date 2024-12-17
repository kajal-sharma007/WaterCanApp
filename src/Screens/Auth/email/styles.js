import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomText: {
    fontSize: 12,
    color: '#409C59',
    paddingBottom: 5,
  },
  bottomTextHelp: {
    fontSize: 12,
    color: '#409C59',
    paddingBottom: 5,
  },
  inputWrapper: {
    position: 'relative',
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
  touchable: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '80%',
    alignItems: 'flex-start',
    marginLeft: 60,
  },

  logo: {
    width: 150,
    height: 150,
    marginRight: 10,
    marginTop: 40,
  },
  boldText: {
    fontSize: 22,
    color: '#33333',
    fontWeight: '900',
    fontFamily: 'Inter',
  },
  subText: {
    fontSize: 16,
    color: 'black',
  },
  subsubText: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 1)',
    paddingBottom: 20,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  inputContainer: {
    width: width * 0.85,
    paddingBottom: 10,
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
  eyeIcon: {
    position: 'relative',
    left: 270,
    bottom: 50,
  },
  buttonContainer: {
    paddingTop: 5,
    width: width * 0.85,
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
    backgroundColor: 'rgba(64, 156, 89, 1)',
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
  icon: {
    width: 30,
    height: 30,
    marginRight: -20,
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
    fontFamily: 'Inter',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default styles;
