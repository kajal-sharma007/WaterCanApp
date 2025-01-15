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
import React, {useEffect, useState} from 'react';
import logo from '../../../assets/logo1.jpg';
import Email from '../../../assets/Svg/Email';
import {useNavigation} from '@react-navigation/native';
import PhoneStyle from './PhoneStyle';
import {WIFI} from '../../constants/constants';
import Snackbar from 'react-native-snackbar'; // Import Snackbar

const {width, height} = Dimensions.get('window');

// Floating Label Input Component
const FloatingLabelInput = ({label, value, onChangeText, ...props}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={PhoneStyle.floatingLabelContainer}>
      <Text
        style={[PhoneStyle.floatingLabel, {top: isFocused || value ? -2 : 19}]}>
        {label}
      </Text>
      <TextInput
        style={PhoneStyle.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

// Custom Button Component
const CustomButton = ({icon: Icon, title, onPress}) => {
  return (
    <TouchableOpacity style={PhoneStyle.button} onPress={onPress}>
      <View style={PhoneStyle.buttonContent}>
        {Icon && <Icon />}
        <View style={PhoneStyle.textContainer}>
          <Text style={PhoneStyle.buttonText}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Green Button Component
const GreenButton = ({title, onPress}) => {
  return (
    <TouchableOpacity style={PhoneStyle.greenButton} onPress={onPress}>
      <Text style={PhoneStyle.greenButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const ConnectWithPhone = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');

  // Regular expression for phone number validation (e.g., 10 digits)
  const phoneRegex = /^[0-9]{10}$/;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {},
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {},
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Function to handle the input change and allow only numeric characters
  const handlePhoneChange = input => {
    const numericInput = input.replace(/[^0-9]/g, '');
    setPhoneNumber(numericInput);
  };

  // Function to verify the driver
  const verifyDriver = async () => {
    if (phoneNumber.length < 10) {
      Snackbar.show({
        text: 'Please enter a valid 10-digit phone number',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      return;
    } else if (!phoneRegex.test(phoneNumber)) {
      Snackbar.show({
        text: 'Phone number must be exactly 10 digits',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      return;
    }

    try {
      const response = await fetch(`http://${WIFI}/api/verify-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({mobileNo: phoneNumber}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        Snackbar.show({
          text: errorData.message || 'Verification failed',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
        return;
      }

      const data = await response.json();
      const driverId = data.driver._id;
      console.log('Driver verified:', data);
      navigation.navigate('TabNav', {driverId});
    } catch (error) {
      console.error('Network error:', error);
      Snackbar.show({
        text: `An error occurred. Please try again later. ${error}`,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={PhoneStyle.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={PhoneStyle.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={PhoneStyle.topSection}>
            <Image source={logo} style={PhoneStyle.logo} />
          </View>

          <View style={PhoneStyle.inputContainer}>
            <FloatingLabelInput
              label="Enter Phone Number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
            />
          </View>

          <View style={PhoneStyle.buttonContainer}>
            <GreenButton title="Next" onPress={verifyDriver} />
            <View style={PhoneStyle.separatorContainer}>
              <View style={PhoneStyle.separator} />
              <Text style={PhoneStyle.orText}>or</Text>
              <View style={PhoneStyle.separator} />
            </View>
          </View>

          <View style={PhoneStyle.buttonContainer}>
            <CustomButton
              icon={Email}
              title="Started with Email"
              onPress={() => navigation.navigate('ConnectWithEmail')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ConnectWithPhone;
