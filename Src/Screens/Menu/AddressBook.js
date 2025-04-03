import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import Header from '../../header';

const AddressBook = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const baseurl = await AsyncStorage.getItem('apiBaseUrl');
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');

        if (!baseurl || !phoneNumber) {
          setError('Base URL or phone number not found.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseurl}address/getaddress/${phoneNumber}`);
        const data = await response.json();
console.log(data)
        if (data && data.length > 0) {
          setAddresses(data); // Set addresses if found
        } else {
          setAddresses([]); // No data found
        }
      } catch (err) {
        setError('Error fetching addresses.');
      } finally {
        setLoading(false); // Stop loading once the API call is complete
      }
    };

    // Listen for screen focus and fetch addresses whenever the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true); // Reset loading state to true each time the screen is focused
      fetchAddresses(); // Fetch addresses every time the screen comes into focus
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
           <Header title="Address Book" navigation={navigation} />

      
      <ScrollView style={styles.addressList}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : addresses.length === 0 ? (
          <Text style={styles.noDataText}>No addresses found.</Text>
        ) : (
          addresses.map((item, index) => (
            <View key={index} style={styles.addressItem}>
              <View style={styles.addressIconContainer}>
                <MaterialIcons name="location-pin" size={24} color="orange" />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressTitle}>{item.saveAs}</Text>
                <Text style={styles.address}>{item.flat} {item.landmark} {item.street} {item.location}</Text>
                <Text style={styles.addressDescription}>{item.city} {item.state}</Text>
              </View>
              <TouchableOpacity style={styles.moreIcon}>
                <MaterialIcons name="more-vert" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('Address')} // Navigate to the Add Address screen
      >
        <Text style={styles.addButtonText}>+ Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:20
  },
  header: {
    backgroundColor: '#D83F3F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',  // Adjusted to space between the items
    marginTop: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Makes the header title take up all available space
    textAlign: 'center', // Centers the title
  },
  backButton: {
    marginRight: 10,
  },
  addressList: {
    padding: 20,
  },
  addressItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
  },
  addressIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    color: '#333',
    marginTop: 5,
  },
  addressDescription: {
    color: 'grey',
    marginTop: 5,
  },
  moreIcon: {
    marginLeft: 10,
  },
  addButton: {
    margin: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
  },
});
