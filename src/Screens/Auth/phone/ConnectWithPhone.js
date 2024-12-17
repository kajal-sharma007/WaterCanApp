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

const {width, height} = Dimensions.get('window');

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

const GreenButton = ({title, onPress}) => {
  return (
    <TouchableOpacity style={PhoneStyle.greenButton} onPress={onPress}>
      <Text style={PhoneStyle.greenButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const ConnectWithPhone = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [placeholderTop] = useState(new Animated.Value(20));

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


  const verifyDriver = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.5:9000/api/verify-driver',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({mobileNo: phoneNumber}),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(errorData.message || 'Verification failed');
        return;
      }

      const data = await response.json();
      const driverId = data.driver._id;
      console.log('Driver verified:', data);
      navigation.navigate('TabNav', {driverId});
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred. Please try again later.');
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
              value={phoneNumber}
              onChangeText={setPhoneNumber}
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
