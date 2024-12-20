import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const Styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    customerContainer: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
      width: '100%',
    },
    customerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    detailsContainer: {
      marginTop: 20,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#20B2AA',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginBottom: 15,
      marginTop: 15,
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: '#fff',
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      marginTop: 20,
    },
  });
  export default Styles;