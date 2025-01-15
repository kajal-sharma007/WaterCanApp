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
    paddingVertical: 25,
    paddingBottom: 15,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  rating: {
    fontSize: 18,
    color: '#fff',
  },
  details: {
    backgroundColor: '#fff',
    padding: 25,
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#15837d',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#15837d',
    borderRadius: 25,
    backgroundColor: '#e0f7f3',
    marginTop: 10,
    overflow: 'hidden',
  },
  picker: {
    height: '100%',
    width: '100%',
    color: '#15837d',
  },
  footer: {
    padding: 20,
    marginTop: 40,
    alignItems: 'center',
  },
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    justifyContent: 'center',
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  Image: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  errorText: {
    fontSize: 20,
    color: '#DC143C',
    textAlign: 'center',
    marginTop: 20,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#20B2AA',
  },
});

export default Styles;
