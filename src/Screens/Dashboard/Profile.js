import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import edit from '../../assets/Svg/edit.png';
import exit from '../../assets/Svg/exit.png';
import user from '../../assets/Svg/user.png';

const Profile = ({ route, navigation }) => {
  const { driverId } = route.params; // Assuming driverId is passed via navigation
  
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Driver ID Profile :', driverId); // Log the driverId to confirm it is valid
  }, [driverId]);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://192.168.1.6:9000/api/driver/${driverId}`);
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
      const response = await fetch(`http://192.168.1.6:9000/api/delete-driver/${driverId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // On successful logout, navigate to the login screen or main screen
      alert('You have logged out successfully.');
      navigation.navigate('Onboarding'); // Change 'Login' to the appropriate screen name

    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error logging out. Please try again.');
    }
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
        <Image source={user} style={styles.profileImage} />
        <Text style={styles.name}>{deliveryMan.name}</Text>
        {/* <Text style={styles.rating}>Rating: {deliveryMan.rating} ★</Text> */}
      </View>

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Contact Information</Text>
        <Text style={styles.detailText}>Phone: {deliveryMan.mobileNo}</Text>
        <Text style={styles.detailText}>Email: {deliveryMan.email}</Text>
        
        <Text style={styles.detailTitle}>Vehicle</Text>
        <Text style={styles.detailText}>Vehicle: Motorcycle</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Image source={edit} style={styles.Image} />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
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
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 40,
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
    marginTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    padding: 20,
    marginTop: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
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
});

export default Profile;
