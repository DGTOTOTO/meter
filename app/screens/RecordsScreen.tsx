import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

interface Record {
  id: string;
  value: number;
  timestamp: string; // 包含时间戳
}

export default function RecordsScreen() {
  const [records, setRecords] = useState<Record[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Function to load records from AsyncStorage
    const loadRecords = async () => {
      try {
        const records = await AsyncStorage.getItem('records');
        const parsedRecords: Array<{ id: string; value: number; timestamp: string }> = records ? JSON.parse(records) : [];
        console.log("Parsed Records:", parsedRecords);
        setRecords(parsedRecords);
      } catch (error) {
        console.error("Failed to load records:", error);
      }
    };

    // Function to handle reset
    const handleReset = () => {
      Alert.alert(
        "确认重置",
        "你确定要清空所有记录并重置计数器吗？",
        [
          {
            text: "取消",
            style: "cancel",
          },
          {
            text: "重置",
            style: "destructive",
            onPress: async () => {
              try {
                await AsyncStorage.removeItem('records');
                setRecords([]);
                await AsyncStorage.setItem('sum', '0'); // 重置 sum
              } catch (error) {
                console.error("Failed to reset records:", error);
              }
            },
          },
        ]
      );
    };

    // Set navigation options to add the reset button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButtonText}>重置</Text>
        </TouchableOpacity>
      ),
    });

    // Load records when screen gains focus
    const unsubscribe = navigation.addListener('focus', loadRecords);

    return unsubscribe;
  }, [navigation]);

  // Function to remove a record
  const removeRecord = async (id: string, value: number) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));

    // Update sum
    const storedSum = await AsyncStorage.getItem('sum');
    const currentSum = storedSum ? parseInt(storedSum) : 0;
    const newSum = currentSum - value;
    await AsyncStorage.setItem('sum', newSum.toString());
  };

  // Render each record item
  const renderItem = ({ item }: { item: Record }) => (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeRecord(item.id, item.value)}
          >
            <Text style={styles.deleteText}>删除</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.recordItem}>
          <Text style={styles.recordText}>+{item.value}</Text>
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  recordItem: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recordText: {
    fontSize: 20,
  },
  timestampText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#007AFF',
    fontSize: 16,
    paddingRight: 10,
  },
});
