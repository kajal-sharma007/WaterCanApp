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
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import logo from '../../assets/logo1.jpg';
  import Call from '../../assets/Svg/Call';
  
  import {useNavigation} from '@react-navigation/native';
  import CommonButton from '../../component/button';
//   // Import SVG components directly
//   import Apple from '../../asset/SVG/Apple'; // Import SVG components
//   import Email from '../../asset/SVG/Email';
//   import Facebook from '../../asset/SVG/Facebook';
//   import Google from '../../asset/SVG/Google';
//   import GetstartwithFace from '../../asset/SVG/ScanFace';
  
//   import {useTranslation} from 'react-i18next';
  
  const {width, height} = Dimensions.get('window');
  
  // Custom Floating Label Input Component
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
  const ConnectWithEmail = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    // const {t} = useTranslation();
  
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
              label='Password'
              keyboardType="email-address"
              value={Password}
              onChangeText={setPassword}
            />
          </View>
  
          <View style={styles.buttonContainer}>
            <CommonButton
              title='Next'
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
  