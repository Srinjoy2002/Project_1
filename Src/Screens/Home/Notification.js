import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("travel"); // Default tab is "travel"

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const baseurl = await AsyncStorage.getItem('apiBaseUrl');
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');

        if (!baseurl) {
          setError('Base URL not found.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseurl}map/consignment-notification`);
        // const response = await fetch(`${baseurl}api/getnotifications`);

        const data = await response.json();

        if (data && data.notifications) {
          setNotifications(data.notifications);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        setError('Error fetching notifications.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchNotifications();
    });

    return unsubscribe;
  }, [navigation]);

  const travelNotifications = notifications.filter(item => item.notificationFormat === "travel");
  const consignmentNotifications = notifications.filter(item => item.notificationFormat === "consignment");




  const create_payment_order = async () => {
    // Check if the amount is a valid number and within the range
   

    setLoading(true);
    try {
        

        const response = await fetch(`https://egadgetworld.in/payment/wallet-generate-order?amount=500`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();
        console.log('res', json);
        if (response.ok) {
            navigation.navigate('WalletWebViewScreen', { 
                url: `https://egadgetworld.in/payment/wallet-open-payment?order_id=${json.id}&name=naman&number=8319339945&email=jnaman345@gmail.com&amount=${json.amount}&userid=1&address=null&type=wallet`
            });
        } else {
            alert('Something Went Wrong');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to Place Order');
    } finally {
        setLoading(false); // Hide loader
    }
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }






  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "travel" && styles.activeTab]}
          onPress={() => setActiveTab("travel")}
        >
          <Text style={[styles.tabText, activeTab === "travel" && styles.activeTabText]}>
            Travel Updates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "consignment" && styles.activeTab]}
          onPress={() => setActiveTab("consignment")}
        >
          <Text style={[styles.tabText, activeTab === "consignment" && styles.activeTabText]}>
            Consignment Updates
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList}>
  {error ? (
    <Text style={styles.errorText}>{error}</Text>
  ) : (
    (activeTab === "travel" ? travelNotifications : consignmentNotifications).length === 0 ? (
      <Text style={styles.noDataText}>No notifications found.</Text>
    ) : (
      (activeTab === "travel" ? travelNotifications : consignmentNotifications).map((item, index) => (
<TouchableOpacity 
  onPress={() => {
    if (item.notificationType === 'consignment_request') {
      navigation.navigate('ConsignmentRequest');
    } else if (item.notificationType === 'travel_request') {
      create_payment_order();
      // navigation.navigate('TravelRequest');

    }
  }}
>
        <View key={index} style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
          </View>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        </TouchableOpacity>
      ))
    )
  )}
</ScrollView>

    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#D83F3F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop:20,
    margin:10,
    borderWidth: 2,
    borderColor:'#7C7C7C',
    borderRadius: 5,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#A4CE39',
    color:'white'
  },
  tabText: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notificationsList: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
    borderLeftWidth: 5,
    borderLeftColor: '#53B175',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationSubtitle: {
    color: '#333',
    marginTop: 5,
  },
  notificationTime: {
    color: '#888',
    fontSize: 14,
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
});
