import {StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import logo from '../../assets/logo1.jpg'; 

const Splash = () => {
  const navigation = useNavigation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      if (isMounted) {
        navigation.navigate('Onboarding');
      }
    }, 1000);

    return () => {
      setIsMounted(false);
      clearTimeout(timer);
    };
  }, [navigation, isMounted]);

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});
