import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import Home from '../Screens/Dashboard/Home';
import Profile from '../Screens/Dashboard/Profile';
import Route from '../Screens/Dashboard/Route';
import AddCustomer from '../Screens/Dashboard/AddCustomer';
import house from '../assets/Svg/house.png';
import delivery from '../assets/Svg/delivery.png';
import queue from '../assets/Svg/queue.png';
import user from '../assets/Svg/user.png';


const Tab = createBottomTabNavigator();
const TabNavigator = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#409C59',
        tabBarInactiveTintColor: '#061E14',
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fff',
          width: '100%',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 25,
          borderColor: '#f2f2f2',
          borderWidth: 1,
        },
        tabBarIconStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: () => (
            <Image
              source={house}
              style={{width: 20, height: 20}} // Standardized icon size
            />
          ),
        }}
      />

      <Tab.Screen
        name='Route'
        component={Route}
        options={{
          tabBarIcon: () => (
            <Image
              source={delivery}
              style={{width: 21, height: 20.5}} // Standardized icon size
            />
          ),
        }}
      />

      <Tab.Screen
        name='Add Customer'
        component={AddCustomer}
        options={{
          tabBarIcon: () => (
            <Image
              source={queue}
              style={{width: 18, height: 20}} // Standardized icon size
            />
          ),
        }}
      />

      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarIcon: () => (
            <Image
              source={user}
              style={{width: 18, height: 20}} // Standardized icon size
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
