import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,Platform
  } from 'react-native';
  import React from 'react';
  import Swiper from 'react-native-swiper';
  import logo from '../../assets/logo1.jpg';
  import girlBag from '../../assets/slider.png';
  import girlWeb from '../../assets/slider.png';
  import guyPhoto from '../../assets/slider.png';
//   import Apple from '../../asset/SVG/Apple'; // Import SVG components
  import Call from '../../assets/Svg/Call';
  import Email from '../../assets/Svg/Email';
//   import Facebook from '../../asset/SVG/Facebook';
//   import Google from '../../asset/SVG/Google';
//   import GetstartwithFace from '../../asset/SVG/ScanFace';
  import {useNavigation} from '@react-navigation/native';
  
  
//   import {useTranslation} from 'react-i18next';
  // import {Platform} from 'react-native';
  
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
    // const {t} = useTranslation();
  
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
  
            <View style={styles.swiperContainer}>
              <Swiper
                style={styles.wrapper}
                autoplay
                autoplayTimeout={3}
                showsButtons={false}
                showsPagination={false}
                loop={true}>
                <View style={styles.slide}>
                  <Image source={girlBag} style={styles.image} />
                </View>
                <View style={styles.slide}>
                  <Image source={guyPhoto} style={styles.image} />
                </View>
                <View style={styles.slide}>
                  <Image source={girlWeb} style={styles.image} />
                </View>
              </Swiper>
            </View>
          </View>
  
          <View style={styles.buttonContainer}>
            <CustomButton
              icon={Call}
              title='Started with Phone'
              onPress={() => navigation.navigate('ConnectWithPhone')}
            />
            {/* <CustomButton icon={Google} title={t('google')} onPress={() => {}} />
            <CustomButton
              icon={Facebook}
              title={t('facebook')}
              onPress={() => {}}
            />
            <CustomButton icon={Apple} title={t('apple')} onPress={() => {}} /> */}
            <CustomButton
              icon={Email}
              title='Started with Email'
              onPress={() => navigation.navigate('ConnectWithEmail')}
            />
            {/* <CustomButton
              icon={GetstartwithFace}
              title={t('face')}
              onPress={() => navigation.navigate('ScanFace')}
            /> */}
          </View>
  
          {/* <Text style={styles.subsubText}>
            {t('terms')} {'\n'} {t('terms2')}
          </Text> */}
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
      paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    scrollContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 25,
    },
    topSection: {
      flex: 1,
      alignItems: 'center',
      // width: '100%',
    },
  
    touchable: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Platform.OS === 'ios' ? 50 : 20,
      width: Platform.OS === 'ios' ? '90%' : '80%',
    },
    logo: {
      width: 100,
      height: 100,
      marginHorizontal:-20
    },
    boldText: {
      fontSize: 22,
      color: '#333333',
      fontWeight: 'bold',
      fontFamily: 'Inter',
      textAlign: Platform.OS === 'ios' ? 'left' : 'left',
    },
    subText: {
      fontSize: 16,
      color: '#333333',
      fontFamily: 'Inter',
      textAlign: Platform.OS === 'ios' ? 'left' : 'left',
    },
    subsubText: {
      fontSize: 12,
      color: '#333333',
      textAlign: 'center',
      paddingBottom: Platform.OS === 'ios' ? 40 : 20,
      fontFamily: 'Inter',
    },
    swiperContainer: {
      height: height * 0.3,
      width: width,
    },
    wrapper: {},
    slide: {
      flex: 1,
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
      paddingBottom: Platform.OS === 'ios' ? 50 : 30,
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
    icon: {
      width: 30,
      height: 30,
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
  