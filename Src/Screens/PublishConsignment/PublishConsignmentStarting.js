import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome Icon for calendar
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons


// Get screen dimensions
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

const PublishStarting = ({ navigation }) => {


  const [userName, setUserName] = useState('');


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('startingLocation');
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Starting Location</Text>
      </View>

      {/* Location Input Section */}
      <View style={styles.locationContainer}>
        <View style={styles.locationInput}>


          
          <FontAwesome name="circle" size={10} color="green" style={styles.dotIndicator} />
          <Text style={styles.locationText}>{userName}</Text>
          <TouchableOpacity>
            <Entypo name="cross" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Favorites Section */}
      <Text style={styles.favoritesTitle}>Favourites</Text>
      <View style={styles.favoritesContainer}>
        <TouchableOpacity style={styles.favoriteItem}>
          <FontAwesome name="home" size={24} color="#53B175" />
          <Text style={styles.favoriteText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteItem}>
          <FontAwesome name="briefcase" size={24} color="#53B175" />
          <Text style={styles.favoriteText}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteItem1}>
          <Entypo name="location-pin" size={24} color="#53B175" />
          <Text style={styles.favoriteText}>Other</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('PublishConsignmentSearchScreen')}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="locate" size={24} color="black" />
          <Text style={styles.navText}>Current Location</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton}>
        <View style={styles.iconContainer}>
          <FontAwesome name="map-marker" size={24} color="black" />
          <Text style={styles.navText}>Locate on Map</Text>
        </View>
      </TouchableOpacity>
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: height * 0.05, // Adjusting for top margin to account for status bar
  },
  header: {
    backgroundColor: '#D83F3F',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: width * 0.05, // Adjusting for screen width
    textAlign: 'center',
    flex: 1, // Centering header text
  },
  locationContainer: {
    backgroundColor: '',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  locationInput: {
    backgroundColor: '#EAECF0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
  },
  dotIndicator: {
    marginRight: width * 0.03, // Dynamic margin based on screen width
  },
  locationText: {
    flex: 1,
    fontSize: width * 0.04, // Adjust font size based on screen width
    color: '#333',
  },
  favoritesTitle: {
   marginHorizontal: width * 0.05,
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    fontSize: width * 0.045, // Dynamic font size based on screen width
    fontWeight: 'bold',
    color: '#333',
  },
  favoritesContainer: {
   marginHorizontal: width*0.01,
   backgroundColor:'white',
   padding:15
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
   paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  favoriteItem1: {
    flexDirection: 'row',
    alignItems: 'center',
   paddingVertical: height * 0.02,

  },
  favoriteText: {
    fontSize: width * 0.04, // Adjust font size based on screen width
    marginLeft: width * 0.04, // Dynamic margin
    color: 'black',
    fontWeight:'bold'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.1, // Adjusting horizontal padding for responsiveness
    paddingVertical: height * 0.03,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 'auto', // Ensuring the bottom nav stays at the bottom
    backgroundColor:'white'
  },
  navButton: {
    alignItems: 'center',
  },
  
  iconContainer: {
    flexDirection: 'column', // Places icon & text in a vertical column
    alignItems: 'center', // Centers items horizontally
    justifyContent: 'center',
  },

navText: {
  fontSize: 14,
    color: 'black',
    marginTop: 5, // Adds space between icon & text
    textAlign: 'center',
   // Space between icon & text
},
});

export default PublishStarting;
