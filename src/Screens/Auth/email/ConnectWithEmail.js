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
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import logo from '../../../assets/logo1.jpg';
import Call from '../../../assets/Svg/Call';
import {useNavigation} from '@react-navigation/native';
import CommonButton from '../../../component/button';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const {width, height} = Dimensions.get('window');

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  isPassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.floatingLabelContainer}>
      <Text style={[styles.floatingLabel, {top: isFocused || value ? -2 : 19}]}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color="#20B2AA"
            />
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

  const handleLogin = async () => {
    try {
      console.log('Login Request Data:', {email, password: Password});

      const response = await fetch(
        'http://192.168.1.3:9000/api/verify-driver',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password: Password,
          }),
        },
      );

      console.log('Server Response Status:', response.status);
      const result = await response.json();
      const driverId = result.driver._id;
      console.log('Response Body:', result);

      if (response.ok) {
        console.log('Login Successful:', result);
        navigation.navigate('TabNav', {driverId});
      } else {
        console.error('Error Response:', result);
        Alert.alert('Login failed', result.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);

      if (error.name === 'TypeError') {
        Alert.alert(
          'Network Error',
          'There was an issue connecting to the server. Please check your connection and try again.',
        );
      } else {
        Alert.alert(
          'Login failed',
          'An unexpected error occurred while trying to log in.',
        );
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
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.inputContainer}>
          <FloatingLabelInput
            label="Enter Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <FloatingLabelInput
            label="Password"
            value={Password}
            onChangeText={setPassword}
            isPassword={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CommonButton title="Next" onPress={handleLogin} />
          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.separator} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            icon={Call}
            title="Started with Phone"
            onPress={() => navigation.navigate('ConnectWithPhone')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConnectWithEmail;
