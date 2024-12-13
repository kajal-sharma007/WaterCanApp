import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FloatingLabelInput from '../component/TextInput'; // Assuming you have a floating label input component
import DocumentPicker from 'react-native-document-picker';

const Download = ({
  label,
  value,
  onChangeText,
  borderColorSelect,
  borderWidthSelect,
  paddingSelect,
}) => {
  const handleTouch = () => {
    console.log('Download component touched!');
  };

  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      onChangeText(res[0].name); // Update the value using the passed down function
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the file picker');
      } else {
        console.error('File picker error: ', err);
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        borderWidthSelect && { width: borderWidthSelect },
        paddingSelect && { paddingRight: paddingSelect },
      ]}
      onTouchStart={handleTouch}
    >
      <FloatingLabelInput
        label={label}
        value={value} // This will show the file name in the input
        onChangeText={onChangeText}
        editable={true}
        style={[styles.input, borderColorSelect && { borderColor: borderColorSelect }]}
      />
      {/* Removed the extra Text component */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleFileSelection}
      >
        <Image source={require('../asset/icons/download.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: 'black',
    height: 60,
  },
  iconButton: {
    position: 'absolute',
    right: 15,
    top: '30%',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default Download;
