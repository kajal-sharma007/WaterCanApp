import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import logo from '../../assets/logo1.jpg';
import girlBag from '../../assets/slider.png'; // Use this image as the main image
import {useNavigation} from '@react-navigation/native';
import Call from '../../assets/Svg/Call';
import Email from '../../assets/Svg/Email';

const {width, height} = Dimensions.get('window');

const CustomButton = ({icon: Icon, title, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        {/* Render the passed SVG icon as a component */}
        {Icon && <Icon />}
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Onboarding = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={styles.touchable}>
            <TouchableOpacity>
              <Image source={logo} style={styles.logo} />
            </TouchableOpacity>

            <View>
              <Text style={styles.boldText}>WELCOME</Text>
              <Text style={styles.subText}>Let's get started</Text>
            </View>
          </View>

          {/* Single Image Display */}
          <View style={styles.imageContainer}>
            <Image source={girlBag} style={styles.image} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            icon={Call}
            title="Started with Phone"
            onPress={() => navigation.navigate('ConnectWithPhone')}
          />
          <CustomButton
            icon={Email}
            title="Started with Email"
            onPress={() => navigation.navigate('ConnectWithEmail')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
  },
  scrollContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 25,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
  },

  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  logo: {
    width: 100,
    height: 100,
    marginHorizontal: -20,
  },
  boldText: {
    fontSize: 22,
    color: '#333333',
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'left',
  },
  subText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Inter',
    textAlign: 'left',
  },
  imageContainer: {
    height: height * 0.35, // Adjust the height of the image as needed
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.35,
    resizeMode: 'contain',
  },
  buttonContainer: {
    paddingTop: 5,
    width: width * 0.85,
    paddingBottom: 30,
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
    fontFamily: 'Inter',
  },
});
