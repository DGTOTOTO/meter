import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function MeterScreen() {
  const [counter, setCounter] = useState<number>(0);
  const navigation = useNavigation(); // 获取 navigation 对象

  // Function to load the sum from AsyncStorage
  const loadSum = async () => {
    try {
      const storedSum = await AsyncStorage.getItem('sum');
      const currentSum = storedSum ? parseInt(storedSum) : 0;
      setCounter(currentSum);
    } catch (error) {
      console.error("Failed to load sum:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSum);
    return unsubscribe;
  }, [navigation]);

    const handleAdd = () => {
    Alert.prompt(
      '输入数字',
      '请输入一个数字来增加计数器:',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async (input) => {
            const value = parseInt(input ?? "");
            if (!isNaN(value)) {
              const newRecord = {
                id: Date.now().toString(),
                value,
                timestamp: new Date().toLocaleString(),
              };

              const records = await AsyncStorage.getItem('records');
              const updatedRecords: Array<{ id: string; value: number; timestamp: string }> = records ? JSON.parse(records) : [];
              updatedRecords.unshift(newRecord);

              await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));

              // Update sum
              const storedSum = await AsyncStorage.getItem('sum');
              const currentSum = storedSum ? parseInt(storedSum) : 0;
              const newSum = currentSum + value;
              await AsyncStorage.setItem('sum', newSum.toString());

              setCounter(newSum);  // 更新计时器
            }
          },
        },
      ],
      'plain-text',
      '',
      'number-pad'
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.counter}>{counter}</Text>
      <Button title="增加计数" color="#1E90FF" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: 80,
    marginBottom: 20,
  },
});
