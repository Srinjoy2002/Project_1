import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, FlatList, Image, Platform,
  Share,
  StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 20 : 0;

const Account = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+918458428422'); 

  useEffect(() => {
    const fetchUserName = async () => {
      if (!phoneNumber) {
        console.warn('Phone number is missing');
        return;
      }

      try {
        const response = await axios.get(`http://192.168.1.4:5002/api/getall`, {
          params: { phoneNumber },
        });

        if (response.data && response.data.user) {
          setUserName(response.data.user.name);
        }
      } catch (error) {
        console.error('Error fetching user name:', error.message);
      }
    };

    fetchUserName();
  }, [phoneNumber]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing app: [Your App Link Here]',
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userLog');
      navigation.navigate('Start');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const menuItems = [
    { logo: require('../../Images/ride_history.png'), name: 'Travel History', screen: 'TravelHistory' },
    { logo: require('../../Images/consignments_history.png'), name: 'Consignments History', screen: 'ConsignmentsHistory' },
    { logo: require('../../Images/Earnings.png'), name: 'Earnings', screen: 'Earnings' },
    { logo: require('../../Images/Address Book.png'), name: 'Address Book', screen: 'AddressBook' },
  ];

  const otherItems = [
    { logo: require('../../Images/About Us.png'), name: 'About Us', screen: 'About Us' },
    { logo: require('../../Images/Help & Support.png'), name: 'Help & Support', screen: 'Help' },
    { logo: require('../../Images/Feedback Form.png'), name: 'Feedback Form', screen: 'Feedback' },
    { logo: require('../../Images/Privacy Policy.png'), name: 'Privacy Policy', screen: 'PrivacyPolicy' },
    { logo: require('../../Images/Terms & Conditions.png'), name: 'Terms & Conditions', screen: 'TermsCondition' },
  ];

  const specialItems = [
    { logo: require('../../Images/Share.png'), name: 'Share this app', action: handleShare },
    { logo: require('../../Images/login.png'), name: 'Logout', action: handleLogout },
  ];

  const allItems = [
    ...menuItems,
    { name: 'Separator', isSeparator: true },
    ...otherItems,
    { name: 'Separator', isSeparator: true },
    ...specialItems,
  ];

  const renderItem = ({ item }) => {
    if (item.isSeparator) {
      return <View style={styles.sectionSeparator} />;
    }

    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          if (item.action) {
            item.action();
          } else {
            navigation.navigate(item.screen, { phoneNumber });
          }
        }}
      >
        <Image source={item.logo} style={styles.menuLogo} />
        <Text 
  style={[
    styles.menuText, 
    item.name === 'Logout' ? { color: '#FB344F' } : {}
  ]}
>
  {item.name}
</Text>
{!['Share this app', 'Logout'].includes(item.name) && (
        <Icon name="chevron-forward" size={24} color="#323232" />
      )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hi {userName || 'User'}!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.editProfileContainer}>
  <Text style={styles.editProfileText}>Edit Profile</Text>
  <Icon name="chevron-forward" size={20} color="white" />
</TouchableOpacity>

        </View>
        <Image source={require('../../Images/kyc.png')} style={styles.profilePic} />
      </View>

      {/* Menu Items */}
      <FlatList
        data={allItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.menuList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginTop: 40 },
  header: {
    flexDirection: 'row',
    paddingTop: statusBarHeight + 20,
    padding: 20,
    backgroundColor: '#D83F3F',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    marginTop: 0,
  },
  greetingContainer: { flex: 1 },
  greeting: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  editProfile: { color: '#fff', marginTop: 10 },
  profilePic: { width: 50, height: 50, borderRadius: 50 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f1f1', 
  },
  menuLogo: { width: 20, height: 20, marginRight: 15, resizeMode: 'contain' },
  menuText: { flex: 1, fontSize: 16, color: '#333', fontWeight: 'bold' },
  sectionSeparator: { height: 10, backgroundColor: '#f1f1f1' },
  separator: { height: 1, backgroundColor: '#f1f1f1' },
  menuList: { marginTop: 20 },
  editProfileContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10,
  },
  editProfileText: {
    color: '#fff', 
    fontSize: 16,
    marginRight: 5, // Space between text and icon
  },
});

export default Account;
