import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const CommonButton = ({title, onPress, greenBorder, style, textColor}) => {
  return (
    <TouchableOpacity
      style={[
        styles.commonButton,
        greenBorder ? styles.greenBorder : styles.defaultBorder,
        style, // Custom styles passed from the parent component
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.commonButtonText,
          greenBorder && styles.greenText,
          textColor && {color: textColor},
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  commonButton: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  defaultBorder: {
    backgroundColor: '#20B2AA', // Default background
  },
  greenBorder: {
    backgroundColor: 'white', // White background for green border
    borderColor: 'green', // Green border
    borderWidth: 2, // Border width
  },
  commonButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white', // Default text color
  },
  greenText: {
    color: 'green', // Green text for green border
  },
});

export default CommonButton;
