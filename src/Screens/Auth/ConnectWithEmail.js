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
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo1.jpg';
import Call from '../../assets/Svg/Call';
import { useNavigation } from '@react-navigation/native';
import CommonButton from '../../component/button';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

// Custom Floating Label Input Component
const FloatingLabelInput = ({ label, value, onChangeText, isPassword, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  return (
    <View style={styles.floatingLabelContainer}>
      <Text
        style={[styles.floatingLabel, { top: isFocused || value ? -2 : 19 }]}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword} // Conditionally secure the text
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#20B2AA" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const CustomButton = ({icon: Icon, title, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        {Icon && <Icon />}
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ConnectWithEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      // Handle the keyboard showing, if needed
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Handle the keyboard hiding, if needed
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    try {
      // Log request body to make sure data is being sent
      console.log("Login Request Data:", { email, password: Password });
  
      const response = await fetch('http://192.168.1.6:9000/api/verify-driver', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: Password,
        }),
      });
  
      // Log the status and response from the server
      console.log("Server Response Status:", response.status);
      const result = await response.json();
      const driverId = result.driver._id;
      console.log("Response Body:", result);  // Log the actual body of the response
  
      if (response.ok) {
        // Successfully logged in, navigate to the next screen
        console.log('Login Successful:', result);
        navigation.navigate('TabNav', { driverId });  // Pass driverId as route param
      } else {
        // Show error message from the API response
        console.error('Error Response:', result);
        Alert.alert('Login failed', result.message || 'Invalid credentials');
      }
    } catch (error) {
      // Log detailed error to diagnose the issue
      console.error('Error during login:', error);
  
      if (error.name === 'TypeError') {
        // Network or CORS error
        Alert.alert('Network Error', 'There was an issue connecting to the server. Please check your connection and try again.');
      } else {
        // Other unexpected errors
        Alert.alert('Login failed', 'An unexpected error occurred while trying to log in.');
      }
    }
  };
  
  
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.topSection}>
            <View style={styles.touchable}>
              {/* <View style={{width: '100%', alignItems: 'flex-start'}}>
                <Text style={styles.boldText}>Let's Start</Text>
                <Text style={styles.subText}>Welcome</Text>
              </View> */}
            </View>
            <Image source={logo} style={styles.logo} />
          </View>
  
          <View style={styles.inputContainer}>
            <FloatingLabelInput
              label='Enter Email'
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
             <FloatingLabelInput
          label="Password"
          value={Password}
          onChangeText={setPassword}
          isPassword={true} // Make this a password field
        />
          </View>
  
          <View style={styles.buttonContainer}>
            <CommonButton
              title='Next'
              onPress={handleLogin}
            />
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.separator} />
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
            <CustomButton icon={Apple} title={t('apple')} onPress={() => {}} />
            <CustomButton
              icon={Email}
              title={t('Get_email')}
              onPress={() => navigation.navigate('ConnectWithEmail')}
            />
            <CustomButton
              icon={GetstartwithFace}
              title={t('face')}
              onPress={() => navigation.navigate('ScanFace')}
            /> */}
          </View>
  
          {/* <Text style={styles.subsubText}>
            {t('terms')} {'\n'} {t('terms2')}
          </Text> */}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
  
  export default ConnectWithEmail;
  
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
      width: '80%', // Ensures it takes full width
      alignItems: 'flex-start', // Aligns the items at the start
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
    eyeIcon: {
      position: 'relative',
      left: 270,
      bottom: 50,
      
    },
    buttonContainer: {
      paddingTop: 5,
      width: width * 0.85,
      // paddingBottom: 30,
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
      // marginVertical: 10,
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
  