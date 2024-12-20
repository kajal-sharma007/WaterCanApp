import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker
import exit from '../../../assets/Svg/exit.png';
import user from '../../../assets/Svg/user.png';
import camera from '../../../assets/Svg/camera.png';
import Styles from './Styles';
const Profile = ({ route, navigation }) => {
  const { driverId } = route.params;
  
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('Motorcycle');
  const [profileImage, setProfileImage] = useState(null); // State for profile image

  useEffect(() => {
    console.log('Driver ID Profile :', driverId);
  }, [driverId]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://192.168.1.2:9000/api/driver/${driverId}`);
        if (!response.ok) {
          throw new Error('Profile not found');
        }
        const data = await response.json();
        setDeliveryMan(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [driverId]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://192.168.1.2:9000/api/delete-driver/${driverId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }

      alert('You have logged out successfully.');
      navigation.navigate('Onboarding');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error logging out. Please try again.');
    }
  };

  // Function to handle image selection
  const selectProfileImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri); // Set the selected image URI
      } else {
        console.log('User cancelled image picker');
      }
    });
  };

  if (loading) {
    return (
      <View style={Styles.loaderContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
      </View>
    );
  }

  if (!deliveryMan) {
    return (
      <View style={Styles.container}>
        <Text style={Styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={Styles.container}>
      <View style={Styles.header}>
        <TouchableOpacity onPress={selectProfileImage}>
          <Image
            source={profileImage ? { uri: profileImage } : user} // Use selected image or default image
            style={Styles.profileImage}
          />
          <Image source={camera} style={Styles.cameraIcon}/>
        </TouchableOpacity>
        <Text style={Styles.name}>{deliveryMan.name}</Text>
        <Text style={Styles.rating}>{deliveryMan.email}</Text>
      </View>

      <View style={Styles.details}>
        <Text style={Styles.detailTitle}>Contact Information</Text>
        <Text style={Styles.detailText}>Name: {deliveryMan.name}</Text>
        <Text style={Styles.detailText}>Phone: {deliveryMan.mobileNo}</Text>
        <Text style={Styles.detailText}>Email: {deliveryMan.email}</Text>
        
        <Text style={Styles.detailTitle1}>Vehicle</Text>
        <View style={Styles.pickerContainer}>
          <Picker
            selectedValue={selectedVehicle}
            style={Styles.picker}
            onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
          >
            <Picker.Item label="Motorcycle" value="Motorcycle" />
            <Picker.Item label="Car" value="Car" />
            <Picker.Item label="Bicycle" value="Bicycle" />
          </Picker>
        </View>
      </View>

      <View style={Styles.footer}>
        <TouchableOpacity style={Styles.button1} onPress={handleLogout}>
          <Image source={exit} style={Styles.Image} />
          <Text style={Styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
