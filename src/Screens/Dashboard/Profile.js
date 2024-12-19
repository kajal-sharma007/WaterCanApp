import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker
import exit from '../../assets/Svg/exit.png';
import user from '../../assets/Svg/user.png';
import camera from '../../assets/Svg/camera.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WIFI } from '../constants/constants';


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
        const response = await fetch(`http://${WIFI}/api/driver/${driverId}`);
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
      const response = await fetch(`http://${WIFI}/api/delete-driver/${driverId}`, {
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
      </View>
    );
  }

  if (!deliveryMan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={selectProfileImage}>
          <Image
            source={profileImage ? { uri: profileImage } : user} // Use selected image or default image
            style={styles.profileImage}
          />
          <Image source={camera} style={styles.cameraIcon}/>
        </TouchableOpacity>
        <Text style={styles.name}>{deliveryMan.name}</Text>
        <Text style={styles.rating}>{deliveryMan.email}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Contact Information</Text>
        <Text style={styles.detailText}>Name: {deliveryMan.name}</Text>
        <Text style={styles.detailText}>Phone: {deliveryMan.mobileNo}</Text>
        <Text style={styles.detailText}>Email: {deliveryMan.email}</Text>
        
        <Text style={styles.detailTitle1}>Vehicle</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedVehicle}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
          >
            <Picker.Item label="Motorcycle" value="Motorcycle" />
            <Picker.Item label="Car" value="Car" />
            <Picker.Item label="Bicycle" value="Bicycle" />
          </Picker>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button1} onPress={handleLogout}>
          <Image source={exit} style={styles.Image} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  rating: {
    fontSize: 16,
    color: '#fff',
  },
  details: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 5,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#15837d',
    fontWeight:'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#15837d',
    borderRadius: 20, // Border radius applied to the container
    overflow: 'hidden', // This ensures the border radius works
    backgroundColor: '#a2d9d4', // Background color for the picker container
    marginTop:10,
  },
  picker: {
    height: '100%', // Ensures the Picker takes up the full height of the container
    width: '100%',
  },
  footer: {
    padding: 20,
    marginTop: 50,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  Image: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#DC143C',
    textAlign: 'center',
    marginTop: 20,
  },
  cameraIcon: {
    position: 'relative',
    bottom: 60,
    left: 80,
    height:50,
    width:50
  },
});

export default Profile;
