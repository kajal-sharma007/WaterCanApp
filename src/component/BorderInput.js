import React, {useState} from 'react';
import {TextInput, View, StyleSheet, Text} from 'react-native';

const BorderInput = ({
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
  inputStyle,
  placeholderStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine if the input has text or is focused
  const hasTextOrFocused = value || isFocused;

  return (
    <View style={[styles.inputWrapper, style]}>
      {/* Floating label */}
      <Text
        style={[
          styles.placeholder,
          hasTextOrFocused && styles.placeholderFocused,
          placeholderStyle, // Custom style for the placeholder
        ]}>
        {placeholder}
      </Text>

      {/* TextInput field */}
      <TextInput
        style={[styles.input, inputStyle]} // Allow custom styles for the TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          if (onFocus) onFocus(); // Trigger custom onFocus callback
        }}
        onBlur={() => {
          setIsFocused(false);
          if (onBlur) onBlur(); // Trigger custom onBlur callback
        }}
        placeholder=""
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 10,
    paddingTop: 1, // Creates space for the floating label
  },
  input: {
    // width: '100%',
    // height: '100%',
    paddingLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 16,
    color: '#999',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  placeholderFocused: {
    top: -10, // Moves the label above the input
    fontSize: 12, // Shrinks the label
    color: '#999', // Custom color when focused
  },
});

export default BorderInput;
