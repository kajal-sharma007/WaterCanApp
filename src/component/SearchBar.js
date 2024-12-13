import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Import the Feather icon library (or choose another icon set)
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSearch }) => {
  const { t } = useTranslation();  // Use the useTranslation hook here
  const [query, setQuery] = useState('');
  
  const handleChangeText = text => {
    setQuery(text);
    if (onSearch) {
      onSearch(text); // Call the onSearch callback to send the query upwards
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch(''); // Trigger search with an empty query when clearing
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <Icon name="search" size={16} color="#A9A9A9" style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={t('search')}  // Now you can safely use t() here
        value={query}
        onChangeText={handleChangeText}
        placeholderTextColor="#A9A9A9"
        textAlignVertical="center" // Vertically centers the placeholder text
      />

      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearText}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 8,
    paddingVertical: 3,
    height: 40,
    // Shadow styles for iOS
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 0, height: 4}, // Offset the shadow
    shadowOpacity: 0.1, // Transparency of the shadow
    shadowRadius: 10, // Blur radius of the shadow
    marginBottom: 21,
    // Elevation for Android
    elevation: 8, // Elevation for Android (shadow effect)
  },
  icon: {
    marginRight: 5,
    marginLeft: 5,
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#929292',
    textAlign: Platform.OS === 'ios' ? 'left' : 'left',
    paddingTop: 0, // Remove paddingTop for perfect vertical centering
    paddingBottom: 0, // Adjust padding to avoid unnecessary space
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearText: {
    fontSize: 18,
    color: '#929292',
  },
});

export default SearchBar;
