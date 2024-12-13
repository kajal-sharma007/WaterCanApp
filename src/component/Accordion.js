import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import arrow from '../asset/SVG/blackarrow.png'; // Adjust the path as necessary

const Accordion = ({
  title,
  items,
  onSelect,
  isOpen,
  toggle,
  noShift = false,
  borderColor = '#AFAFAF', // Default border color (you can pass any color here)
  width = '100%', // Default width is 100%, can be customized by passing a value
}) => {
  const [flashedItemIndex, setFlashedItemIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(title); // Initially, display the title in the header

  const handleItemClick = (item, index) => {
    // Flash the clicked item for 300ms
    setFlashedItemIndex(index);
    setSelectedItem(item.item); // Update the selected item in the header
    onSelect(item.item);

    setTimeout(() => {
      setFlashedItemIndex(null); // Reset flash after 300ms
      toggle(); // Close the accordion after selection
    }, 300); // Flash duration
  };

  const renderAccordionContent = () => (
    <View
      style={[
        styles.accordionContent,
        isOpen && styles.accordionContentOpen,
        {borderColor: borderColor, width: width}, // Apply the width prop here
      ]}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleItemClick(item, index)}
          style={[
            styles.accordionItemContainer,
            flashedItemIndex === index && styles.itemFlashed, // Apply flash effect
          ]}>
          {/* Display selectedIcon only when the item is flashed, otherwise use the regular icon */}
          <Image
            source={flashedItemIndex === index ? item.selectedIcon : item.icon}
            style={styles.itemIcon}
          />
          <Text style={styles.accordionItem}>{item.item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.accordionContainer, {width: width}]}>
      {/* Apply width to the container */}
      <TouchableOpacity style={styles.accordionHeader} onPress={toggle}>
        <View
          style={[
            styles.accordionInput,
            isOpen && styles.accordionInputOpen,
            {borderColor: borderColor, width: width}, // Apply width to the header
          ]}>
          <Text style={styles.accordionTitle}>{selectedItem}</Text>
          <Image source={arrow} style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
      {noShift ? (
        // If noShift is true, apply absolute positioning for the dropdown
        <View style={styles.dropdownWrapper}>
          {isOpen && renderAccordionContent()}
        </View>
      ) : (
        // Regular Accordion that shifts layout when opened
        isOpen && renderAccordionContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    marginVertical: 10,
  },
  accordionHeader: {
    padding: 0,
  },
  accordionInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1, // Default border width
    borderRadius: 10,
    padding: 15,
    backgroundColor: 'white',
  },
  accordionInputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  accordionTitle: {
    fontSize: 12,
    color: 'gray',
  },
  arrowIcon: {
    width: 17,
    height: 10,
  },
  accordionContent: {
    width: '100%', // Default width, will be overridden by the prop
    backgroundColor: 'white',
    borderWidth: 1, // Default border width
  },
  accordionContentOpen: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  accordionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 10,
  },
  itemIcon: {
    width: 20,
    height: 20,
    marginRight: 10, // Space between icon and text
  },
  accordionItem: {
    fontSize: 16,
    color: '#AFAFAF',
  },
  itemFlashed: {
    backgroundColor: '#409C59',
    borderRadius: 10,
    opacity: 1,
  },
  // Styles for when noShift is enabled (absolute positioning for dropdown effect)
  dropdownWrapper: {
    position: 'absolute',
    top: '100%', // Position the dropdown right below the header
    left: 0,
    right: 0,
    zIndex: 1, // Ensure it appears above other content
  },
});

export default Accordion;
