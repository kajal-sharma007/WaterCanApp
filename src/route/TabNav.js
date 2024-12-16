import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Home from '../Screens/Dashboard/Home';
import Profile from '../Screens/Dashboard/Profile';
import Route from '../Screens/Dashboard/Route';
import AddCustomer from '../Screens/Dashboard/AddCustomer';
import house from '../assets/Svg/house.png';
import delivery from '../assets/Svg/delivery.png';
import queue from '../assets/Svg/queue.png';
import user from '../assets/Svg/user.png';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  // Extract driverId from route params
  const { driverId } = route.params;

  useEffect(() => {
    console.log('Driver ID Tab :', driverId); // Log the driverId to confirm it is valid
  }, [driverId]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#20B2AA',
        tabBarInactiveTintColor: '#061E14',
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fff',
          width: '100%',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 25,
          borderColor: '#f2f2f2',
          borderWidth: 1,
        },
        tabBarIconStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ driverId }} // Pass driverId to the Home screen
        options={{
          tabBarIcon: () => (
            <Image
              source={house}
              style={{ width: 20, height: 20 }} // Standardized icon size
            />
          ),
        }}
      />

      <Tab.Screen
        name="Route"
        component={Route}
        initialParams={{ driverId }} // Pass driverId to the Route screen
        options={{
          tabBarIcon: () => (
            <Image
              source={delivery}
              style={{ width: 21, height: 20.5 }} // Standardized icon size
            />
          ),
        }}
      />

      <Tab.Screen
        name="Add Customer"
        component={AddCustomer}
        initialParams={{ driverId }} // Pass driverId to the AddCustomer screen
        options={{
          tabBarIcon: () => (
            <Image
              source={queue}
              style={{ width: 18, height: 20 }} // Standardized icon size
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ driverId }} // Pass driverId to the Profile screen
        options={{
          tabBarIcon: () => (
            <Image
              source={user}
              style={{ width: 18, height: 20 }} // Standardized icon size
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
