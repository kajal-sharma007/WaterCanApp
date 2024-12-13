import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    Animated,
    SafeAreaView,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import logo from '../../assets/logo1.jpg';
//   import Apple from '../../asset/SVG/Apple'; // Import SVG components
  import Email from '../../assets/Svg/Email';
//   import Facebook from '../../asset/SVG/Facebook';
//   import Google from '../../asset/SVG/Google';
//   import GetstartwithFace from '../../asset/SVG/ScanFace';
//   import tri from '../../asset/tri.png';
  import { useNavigation } from '@react-navigation/native';
//   import Call from '../../asset/SVG/Call';
  
//   import { useTranslation } from 'react-i18next';
  
  const { width, height } = Dimensions.get('window');

   const FloatingLabelInput = ({label, value, onChangeText, ...props}) => {
      const [isFocused, setIsFocused] = useState(false);
    
      return (
        <View style={styles.floatingLabelContainer}>
          <Text style={[styles.floatingLabel, {top: isFocused || value ? -2 : 19}]}>
            {label}
          </Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </View>
      );
    };
  
  const CustomButton = ({ icon: Icon, title, onPress }) => {
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
  
  const GreenButton = ({ title, onPress }) => {
    return (
      <TouchableOpacity style={styles.greenButton} onPress={onPress}>
        <Text style={styles.greenButtonText}>{title}</Text>
      </TouchableOpacity>
    );
  };
  
  const ConnectWithPhone = () => {
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [placeholderTop] = useState(new Animated.Value(20)); // to animate the placeholder
    // const { t } = useTranslation();
  
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          // Handle the keyboard showing, if needed
        },
      );
  
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          // Handle the keyboard hiding, if needed
        },
      );
  
      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }, []);
  
    // Handle focus change
    const handleFocus = () => {
      setIsFocused(true);
      Animated.timing(placeholderTop, {
        toValue: 0, // Moves placeholder up when focused
        duration: 200,
        useNativeDriver: false,
      }).start();
    };
  
    // Handle blur change
    const handleBlur = () => {
      if (!phoneNumber) {
        setIsFocused(false);
        Animated.timing(placeholderTop, {
          toValue: 20, // Moves placeholder back down if not filled
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    };
  
    // Handle text input change
    const handleChange = text => {
      setPhoneNumber(text);
      if (text) {
        if (!isFocused) {
          setIsFocused(true);
          Animated.timing(placeholderTop, {
            toValue: -20,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      } else {
        if (isFocused) {
          setIsFocused(false);
          Animated.timing(placeholderTop, {
            toValue: 20,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      }
    };
  
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <SafeAreaView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.topSection}>
              <View style={styles.touchable}>
                {/* <View style={{ width: '100%', alignItems: 'flex-start' }}>
                  <Text style={styles.boldText}>WELCOME</Text>
                  <Text style={styles.subText}>Let's get started</Text>
                </View> */}
              </View>
              <Image source={logo} style={styles.logo} />
            </View>
  
            <View style={styles.inputContainer}>
              {/* <Image source={tri} style={styles.triangleIcon} /> */}
              {/* <View style={styles.divider} /> */}
  
              <FloatingLabelInput
              label='Enter Phone Number'
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            </View>
  
            {/* <View style={styles.containerText}>
              <Text
                style={[
                  styles.bottomTextHelp,
                  { flex: 1, textAlign: 'left', paddingLeft: 12 },
                ]}>
                {t('recover')}
              </Text>
              <Text
                style={[
                  styles.bottomTextHelp,
                  { flex: 1, textAlign: 'right', paddingRight: 12 },
                ]}>
                {t('need')}
              </Text>
            </View> */}
  
            <View style={styles.buttonContainer}>
              <GreenButton
                title='Next'
              />
              <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.separator} />
              </View>
            </View>
  
            <View style={styles.buttonContainer}>
              {/* <CustomButton
                icon={Call}
                title={t('phone')}
                onPress={() => navigation.navigate('ConnectWithPhone')}
              />
              <CustomButton icon={Google} title={t('google')} onPress={() => { }} />
              <CustomButton
                icon={Facebook}
                title={t('facebook')}
                onPress={() => { }}
              />
              <CustomButton icon={Apple} title={t('apple')} onPress={() => { }} /> */}
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
      </KeyboardAvoidingView>
  
    );
  };
  
  export default ConnectWithPhone;
  
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
      fontSize: 10,
      color: 'rgba(64, 156, 89, 1)',
      paddingBottom: 5,
      fontFamily: 'Inter',
    },
    bottomTextHelp: {
      fontSize: 10,
      color: '#20B2AA',
      paddingBottom: 5,
      fontFamily: 'Inter',
      fontWeight: '700',
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
      marginLeft: Platform.OS === 'ios' ? 0 : 60
    },
  
    logo: {
      width: 150,
      height: 150,
      marginRight: 10,
      marginTop: 40,
    },
    boldText: {
      fontSize: 24,
      color: '#333333',
      fontWeight: '700',
      fontFamily: 'Inter',
    },
    subText: {
      fontSize: 15,
      color: '#333333',
      fontFamily: 'Inter',
      fontWeight: '400',
    },
    subsubText: {
      fontSize: 10,
      color: '#333333',
      paddingBottom: 20,
      textAlign: 'center',
      fontFamily: 'Inter',
    },
    inputContainer: {
        width: width * 0.85,
        paddingBottom: 10,
    },
    triangleIcon: {
      width: 80,
      height: 30,
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 45,
      fontSize: 16,
      color: '#000',
      marginLeft:Platform.OS === 'ios'? 7:5 ,
    },
    placeholder: {
        position: 'absolute',
        left: 10,
        color: '#20B2AA',
        fontSize: 12,
        marginTop: 15,
        marginLeft: 10,
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
      fontFamily: 'Roboto',
    },
    divider: {
      width: 1.2, 
      height: '100%', 
      backgroundColor: '#409C59',
      marginLeft: -7,
    },
    floatingLabelContainer: {
        // position: 'relative',
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
  