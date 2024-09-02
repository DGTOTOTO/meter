import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { CounterProvider } from './CounterContext';

export default function App() {
  return (
    <CounterProvider>
      <NavigationContainer independent={true}>
        <BottomTabNavigator />
      </NavigationContainer>
    </CounterProvider>
  );
}
