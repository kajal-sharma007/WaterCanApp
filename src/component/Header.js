import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Header = ({
    title,
    leftButton, 
    leftButtonIcon, 
    leftButtonOnClick, 
    rightButton, 
    rightButtonIcon, 
    rightButtonOnClick, 
    backgroundColor = 'white', 
    titleColor = 'black', 
    buttonColor = 'white', 
    leftIconStyle,
    rightIconStyle,
}) => {
    // Helper function to render button with custom icon and action
    const renderButton = (side, icon, onPress, iconStyle) => (
        <TouchableOpacity
            onPress={onPress}
            style={[ 
                side === 'left' ? styles.button_style : styles.right_button_style, 
                { backgroundColor: buttonColor } 
            ]}
            activeOpacity={0.7}>
            {icon && <Image source={icon} style={[styles.arrow_icon, iconStyle]} />} 
        </TouchableOpacity>
    );

    return (
        <View style={[styles.headerContainer, { backgroundColor }]}>
            {/* Conditionally render left button */}
            {leftButton && renderButton('left', leftButtonIcon, leftButtonOnClick, leftIconStyle)}

            {/* Title in the center */}
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

            {/* Conditionally render right button */}
            {rightButton && renderButton('right', rightButtonIcon, rightButtonOnClick, rightIconStyle)}
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        position: 'relative',
        width: '100%',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button_style: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        position: 'absolute',
        left: 15,
    },
    right_button_style: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        position: 'absolute',
        right: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    arrow_icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});
