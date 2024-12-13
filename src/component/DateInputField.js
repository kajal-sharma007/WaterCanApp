// DateInputField.js
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FloatingLabelInput from '../component/TextInput'; // Assuming you have a floating label input component
import Calender from '../asset/SVG/calender.png'; // Calendar icon path
import {format} from 'date-fns'; // Import the format function from date-fns

const DateInputField = ({
  label,
  value,
  onDateChange,
  isDatePickerVisible,
  showDatePicker,
  hideDatePicker,
  borderColorSelect,
  borderWidthSelect,
  paddingSelect,
}) => {
  // Handler when a date is confirmed
  const handleConfirm = date => {
    onDateChange(date); // Set the selected date
    hideDatePicker(); // Close the picker
  };

  // Format the date to MM/DD when displaying
  const formattedDate = value ? format(value, 'MM/dd') : '';

  return (
    <View
      style={[
        styles.container,
        borderWidthSelect && {width: borderWidthSelect},
        paddingSelect && {paddingRight: paddingSelect},
      ]}>
      <FloatingLabelInput
        label={label}
        value={formattedDate} // Display formatted date (MM/DD)
        editable={false} // Make the input uneditable directly
        style={[
          styles.input,
          borderColorSelect && {borderColor: borderColorSelect},
        ]} // Apply custom style to the input
      />
      <TouchableOpacity
        style={styles.iconButton}
        onPress={showDatePicker} // Open the date picker
      >
        <Image source={Calender} style={styles.icon} />
      </TouchableOpacity>

      {/* DatePicker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm} // Handle selected date
        onCancel={hideDatePicker} // Handle cancel
        date={value || new Date()} // Default to current date if no date selected
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%', // Make it take the full width of its container
  },
  input: {
    width: '100%', // Make input field wider
    borderWidth: 1, // Border width
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10, // Optional: Adds rounded corners to the border
    color: 'black', // Set the input value text color to black
    height:60, 
    borderColor:'gray'
  },
  iconButton: {
    position: 'absolute',
    right: 15,
    top: '30%', // Adjust position to be centered vertically
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default DateInputField;
