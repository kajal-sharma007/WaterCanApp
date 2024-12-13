// TabNavigator.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const TabNavigator = ({tabs, selectedTab, onTabSelect}) => {
  return (
    <View style={styles.buttonRow}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabButton,
            selectedTab === tab.toLowerCase() && styles.selectedButton,
          ]}
          onPress={() => onTabSelect(tab.toLowerCase())}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === tab.toLowerCase() && styles.selectedButtonText,
            ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  tabButton: {
    padding: 10,
    width: 110,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EFEFEFEE',
    backgroundColor: 'white',
  },
  selectedButton: {
    backgroundColor: '#409C59',
  },
  selectedButtonText: {
    color: 'white',
  },
  tabButtonText: {
    color: 'rgba(51, 51, 51, 1)',
    fontWeight: '400',
    fontSize: 11,
    textAlign: 'center',
  },
});

export default TabNavigator;
