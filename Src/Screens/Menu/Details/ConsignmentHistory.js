import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../../header';
import commonStyles from '../../../styles';

const TravelHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(true);


    const navigation = useNavigation();



  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        if (phoneNumber) {
          const response = await fetch(`http://192.168.1.4:5002/api/get-consignment/${phoneNumber}`);
          const data = await response.json();
      console.log('rides',data)

                   if (data.consignments) {
            setTravelData(data.consignments);
          }
        }
      } catch (error) {
        console.error("Error fetching travel data: ", error);
      }finally {
        setLoading(false);
      }
    };

    fetchTravelData();
  }, []);

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

  const renderItem = ({ item }) => (


  <TouchableOpacity
      onPress={() => navigation.navigate("ConsignmentHistoryDetails", { ride: item })}
    >

    <View style={styles.card}>
     
     {renderStatusBadge('UPCOMING')}
     
     
      <View>
                  
                  
                 
                        
                         <View style={styles.locationRow}>
                                     <Image source={require("../../../Images/locon.png")} style={styles.locationIcon} />
                           
                                     <Text style={styles.locationText}>
             {item.username} : {item.phoneNumber}
             {'\n'}
             <Text style={styles.callNowText}>{item.startinglocation}</Text>
           </Text>
                       
                         </View>
                         
                         <View style={[commonStyles.verticalseparator, { marginTop: -4,marginBottom:4 }]} />
                         <View style={commonStyles.separator} />
                       
                         <View style={styles.locationRow}>
                            <Image source={require("../../../Images/locend.png")} style={styles.locationIcon} />
                          
           
                            <Text style={styles.locationText}>
             {item.recievername}: {item.recieverphone}
             {'\n'}
             <Text style={styles.callNowText}>{item.goinglocation}</Text>
           </Text>
           
                         </View>
                 
                         <View style={[commonStyles.staraightSeparator, {marginTop:20}]} />
                 
                 
                         {/* Travel Time and Distance */}
                        
                 
                 
           
           
           
           
           
           
           
                   {/* Distance */}
                   
                 </View>
     

     <Text style={{marginLeft:10,fontWeight:'bold',fontSize:14}}>Traveller Details</Text>
   
     
        <View style={styles.driverSection}>
             <Image source={{ uri: 'https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg'}} style={styles.driverPhoto} />
             <View style={styles.driverDetails}>
               <Text style={styles.driverName}>{item.username}</Text>
               <Text style={styles.driverRating}>⭐ {item.rating} ({item.totalRatings} ratings)</Text>
             </View>
           </View>
    
    
      
  
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header title="Consignments History" navigation={navigation} />


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



    {loading ? (
           <ActivityIndicator size="large" color="#0000ff" />
         ) : travelData.length === 0 ? ( 
           <View style={styles.noRidesContainer}>
             <Text style={styles.noRidesText}>No Consignment found</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    height: 60,
    paddingHorizontal: 0,
    marginTop:30
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 2,
    width: 150,
    marginBottom:10,
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft:10,
    fontWeight:'bold'
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
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 8,
    color: '#007BFF',
    fontWeight: '500',
    fontSize: 14,
  },
  icon: {
    width: 16,
    height: 16,
  },

  verticalseparator: {
    width: 1, // Set width to 1 for a thin line
    backgroundColor: '#ddd', // Make the background transparent
    borderStyle: 'dashed', // Dotted border style
    borderLeftWidth: 1, // Add left border to simulate a vertical line
    borderLeftColor: '#ddd', // Set the color for the dotted line
    height: '40', // Set height to 100% or any specific height you need
    marginHorizontal: 11, // Optional: add horizontal spacing if needed
  },


  verticalseparator: {
    width: 1, // Set width to 1 for a thin line
    backgroundColor: '#ddd', // Make the background transparent
    borderStyle: 'dashed', // Dotted border style
    borderLeftWidth: 1, // Add left border to simulate a vertical line
    borderLeftColor: '#ddd', // Set the color for the dotted line
    height: '40', // Set height to 100% or any specific height you need
    marginHorizontal: 11, // Optional: add horizontal spacing if needed
  },
  separator: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    marginLeft: 40,
    marginTop:-20
  },
  callNowText:{
    color: 'black',
    fontSize: 16,
    marginLeft:20,
    marginTop:5,
    fontWeight:'light'


  },
  separator1: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
    marginLeft:5
  },
  infoRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 15,
    color: 'black',
    // fontWeight:'bold',
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
  driverSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding:10
  },
  driverPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    objectFit:'fill'
  },
  driverDetails: {
    flex: 1,
    marginLeft: 10,
  },
  driverName: {
    fontSize: 16,
    // fontWeight: "bold",
  },
  driverRating: {
    fontSize: 12,
    color: "#888",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
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
headerText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft:20
},
headerTitle: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  flex: 1, // Makes the header title take up all available space
  textAlign: 'center', // Centers the title
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
