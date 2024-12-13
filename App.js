import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNav from './src/route/RootNav';

export default function App() {
  return (
    <NavigationContainer>
      <RootNav />
    </NavigationContainer>
  );
}