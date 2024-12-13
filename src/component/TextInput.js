import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

const FloatingLabelInput = ({label, value, onChangeText, ...props}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.floatingLabelContainer}>
      <Text style={[styles.floatingLabel, {top: isFocused || value ? -2 : 19}]}>
        {label}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  floatingLabelContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  floatingLabel: {
    position: 'absolute',
    left: 10,
    color: 'gray',
    fontSize: 12,
    marginTop: 3,
  },
  input: {
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: 'transparent',
    color:'black'
  },
});

export default FloatingLabelInput;
