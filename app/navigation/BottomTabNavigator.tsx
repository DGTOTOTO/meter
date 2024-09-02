import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MeterScreen from '../screens/MeterScreen';
import RecordsScreen from '../screens/RecordsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Meter" component={MeterScreen} />
      <Tab.Screen name="Records" component={RecordsScreen} />
    </Tab.Navigator>
  );
}
