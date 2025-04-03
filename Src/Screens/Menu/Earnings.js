

import React, { useState, useEffect } from 'react';

import { TouchableOpacity, Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For the back button
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // For the currency icon
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialIcons } from '@expo/vector-icons';


// Get device dimensions
const { width, height } = Dimensions.get('window');

const Earnings = ({ navigation }) => {


  const [addresses, setAddresses] = useState([]);
const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const [totelEarning, setTotalEarning] = useState(null);


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

        const response = await fetch(`${baseurl}earn/earning/${phoneNumber}`);
        const data = await response.json();
console.log(data)
        if (data && data.earnings.length > 0) {
          setAddresses(data.earnings); // Set addresses if found
          setTotalEarning(data.totalAmount)
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


  return (
    <View style={styles.container}>
      {/* Header Section */}
      

  <View style={styles.header}>
                  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>My Earnings</Text>
                </View>


      {/* Content Section */}
      



      <ScrollView>
  {error ? (
    <Text style={styles.errorText}>{error}</Text>
  ) : addresses.length === 0 ? (
    <View style={styles.content}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Earnings till date</Text>
        <Text style={styles.summaryValue}>₹0.0</Text>
      </View>
      <View style={styles.start}>
        <View style={styles.circle}>
          <FontAwesome name="rupee" size={45} color="white" />
        </View>
        <Text style={styles.startText}>Finish your first travel to start earnings !!</Text>
      </View>
    </View>
  ) : (
    <View>
      <View style={styles.content}>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Earnings till date</Text>
          <Text style={styles.summaryValue}>{totelEarning}</Text>
        </View>
      </View>

      {addresses.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="south-west" size={20} color="white" />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressTitle}>{item.title}</Text>
            <Text style={styles.address}>
              Travel ID <Text style={{ color: '#373737' }}>{item.travelId}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.moreIcon}>
            <Text style={{ color: '#53B175', fontWeight: 'bold', marginRight: 20 }}>
              {item.amount}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )}
</ScrollView>



    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    flexDirection: 'column',
    marginTop: height * 0.05, // Responsive margin-top (5% of screen height)
    //paddingHorizontal: width * 0.05, // Padding on left and right (5% of screen width)
  },
  header: {
    backgroundColor: '#d32f2f',
    paddingVertical: height * 0.02, // Responsive padding for header
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: width * 0.03, // Margin based on screen width (3%)
  },
  title: {
    fontSize: width * 0.05,  // Responsive font size (5% of screen width)
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    marginTop: height * 0.03, // Margin-top for content (5% of screen height)
    width: '100%',
    flex: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    backgroundColor: '#A4CE39',
    borderRadius: 5,
    paddingVertical: height * 0.02, // Responsive padding
    paddingHorizontal: width * 0.05, // Responsive padding
    marginBottom: height * 0.00, // Margin below the summary box
    width: '95%', // Keep width responsive
    alignItems: 'center',
  },
  summaryText: {
    fontSize: width * 0.04, // Responsive font size
    color: '#fff',
  },
  summaryValue: {
    margin: height * 0.01, // Margin between value and text
    fontSize: width * 0.1, // Larger font size for value
    color: '#fff',
  },
  start: {
    textAlign: 'center',
    alignItems: 'center',
    marginTop: height * 0.1, // Margin-top for the start section (10% of screen height)
  },
  circle: {
    width: width * 0.3,  // 30% of screen width
    height: width * 0.3, // 30% of screen width
    backgroundColor: '#53B175',
    borderRadius: width * 0.15, // Make it a circle (half of width/height)
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.02, // Margin for spacing
  },
  startText: {
    fontSize: width * 0.05, // Responsive font size
    color: '#373737a',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#D83F3F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',  // Adjusted to space between the items
    marginTop: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Makes the header title take up all available space
    textAlign: 'center', // Centers the title
  },
  addressItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
    marginBottom:5
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
    // fontWeight: 'bold',
  },
  address: {
    color: '#7C7C7C',
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
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'#53B175',
    marginRight:20,
    marginLeft:10
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
    marginBottom:5,
    
    elevation: 3,
  
  },

});

export default Earnings;
