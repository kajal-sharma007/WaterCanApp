import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import CommonButton from './button'; // Make sure the button component is correctly imported.

const CustomModal = ({
  visible,
  imageSource,
  message,
  heading,
  onClose,
  retryAction,
  retryButtonText,
  backgroundColor = '#fff', // Default background color is white if not provided
  iconSize = 150, // Default icon size is 150 if not provided
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.modalContainer, {backgroundColor}]}>
        {imageSource && (
          <Image
            source={imageSource}
            style={[styles.image, {width: iconSize, height: iconSize}]}
          />
        )}
        <View style={{textAlign: 'center'}}>
          <Text style={styles.heading}>{heading}</Text>
        </View>
        {message && <Text style={styles.message}>{message}</Text>}
        {retryAction && retryButtonText && (
          <CommonButton
            onPress={retryAction}
            title={retryButtonText}
            style={styles.retryButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '140%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  image: {
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heading: {
    fontFamily: 'Inter', // Ensure you have this font available
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 33,
    letterSpacing: 0.02,
    textAlign: 'center',
    textUnderlinePosition: 'from-font',
    textDecorationSkipInk: 'none',
    marginBottom: 10,
    color: '#fff',
  },
  message: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default CustomModal;
