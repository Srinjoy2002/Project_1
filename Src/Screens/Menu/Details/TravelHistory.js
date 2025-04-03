import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import Header from '../../../header';
import commonStyles from '../../../styles';

const API_URL = 'http://192.168.1.4:5002/t/get-all-rides';

const TravelHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTravelHistory();
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // "1 Feb 2025"
  };

    const navigation = useNavigation();
  

  const fetchTravelHistory = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");

      const response = await fetch(`${API_URL}/${phoneNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('rides',data)
      // console.log('rideslength',data.rides.length)

      if (data.rides) {
        setTravelData(data.rides);
      }
    } catch (error) {
      console.error('Error fetching travel history:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
      const colors = {
        UPCOMING: '#FFF1A6',
        CANCELLED: '#FFEEEB',
        COMPLETED: '#F3FFFA',
      };
  
      const textColors = {
        UPCOMING: '#A18800',
        CANCELLED: '#C92603',
        COMPLETED: '#006939',
      };
  
      return (
        <View style={[styles.badge, { backgroundColor: colors[status] }]} >
          <Text style={{  color: textColors[status],
      fontWeight: '600',
      fontSize: 12,}}>{status}</Text>
        </View>
      );
    };

  const getTravelIcon = (travelMode) => {
    // alert(travelMode)
      switch (travelMode) {
        case 'car':
          return <Icon name="car" size={30} color="#284268" />;
        case 'airplane':
          return <Ionicons name="airplane" size={30} color="#284268" />;
        case 'train':
          return <Icon name="train" size={30} color="#284268" />;
        default:
          return <Ionicons name="help-circle-outline" size={30} color="gray" />; // Default icon
      }
    };


  const renderItem = ({ item }) => (
    

   <TouchableOpacity
      onPress={() => navigation.navigate("TravelHistoryDetails", { ride: item })}
    >
    
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.boldText}>Travel ID: {item._id}</Text>
        {renderStatusBadge('UPCOMING')}
      </View>
  
      <View style={styles.infoRow}>
          <Image source={require("../../../Images/clock.png")} style={[styles.locationIcon, { marginLeft: 5 }]} />
            <Text style={styles.infoText}>{formatDate(item.travelDate)}  {new Date(item.travelDate).toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true // Set to false for 24-hour format
})}</Text>
          </View>
  
     <View>
  
      <View style={commonStyles.staraightSeparator} />
         
          <View style={styles.locationRow}>
                      <Image source={require("../../../Images/locon.png")} style={styles.locationIcon} />
  <View style={commonStyles.iconContainer}></View>
            
            <Text style={commonStyles.locationText}>{item.Leavinglocation}</Text>
        
          </View>
          
          <View style={commonStyles.verticalseparator}>
  
          </View>
          <View style={commonStyles.separator} />
        
          <View style={styles.locationRow}>
             <Image source={require("../../../Images/locend.png")} style={styles.locationIcon} />
  <View style={commonStyles.iconContainer}></View>
          
            <Text style={commonStyles.locationText}>{item.Goinglocation}</Text>
          </View>
  
          <View style={commonStyles.staraightSeparator} />
  
  
          {/* Travel Time and Distance */}
       
  
          </View>
  
    
   
          <View style={commonStyles.locationRow}>
  <View style={commonStyles.iconContainer}>{getTravelIcon(item.travelMode)}</View>
  <Text style={commonStyles.infoText}>
    {item.travelMode.toUpperCase()} - {item.travelmode_number}
  </Text>
</View>


      <View style={commonStyles.staraightSeparator} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../../../Images/box.png')} style={styles.icon} />
          <Text style={styles.buttonText}>{item.consignments} Consignments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../../../Images/route1.png')} style={styles.icon} />
          <Text style={styles.buttonText}>More Info</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );

  return (

    
    <View style={styles.container}>
      {/* Header Section */}
      <Header title="Travel History" navigation={navigation} />

      {/* Search Bar Section */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for past rides"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Image source={require('../../../Images/search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Travel History List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : travelData.length === 0 ? ( 
        <View style={styles.noRidesContainer}>
          <Text style={styles.noRidesText}>No rides found</Text>
        </View>
      ) : (
        <FlatList
          data={travelData.filter(item => item._id.includes(searchText))}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};


export default TravelHistory;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop:20
  },
  
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 40,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f1f1f1',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    marginLeft: 18,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  boldText: {
    // fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
 
  
 
  carRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  carText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding:8
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
  },
  icon: {
    width: 20,
    height: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    marginTop:10
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 10,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 10,
  },
 
 
 
  
  
 
  
  infoRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'black',
    fontWeight:'bold',
    marginLeft:10,
    marginTop:-2
  },
  infoText1: {
    fontSize: 15,
    color: '#555',
    // fontWeight:'bold',
    marginLeft:32,
    marginTop:-10
  },
  infoText2: {
    fontSize: 15,
    color: '#555',
    // fontWeight:'bold',
    marginLeft:-30,
    marginTop:-10
  },
  mapContainer: {
    marginVertical: 0,
    margin: 20,
    
  },
  map: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    objectFit:'cover'
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  vehicleText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  traveler: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  driverPhoto: {
    width: 50,
    height: 50,
    borderRadius: 20,
    objectFit:'contain'
  },
  travelerDetails: {
    flex: 1,
    // padding:10
  },
  travelerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  travelerRating: {
    fontSize: 14,
    color: '#555',
  },
  noRidesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noRidesImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  noRidesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },

});
