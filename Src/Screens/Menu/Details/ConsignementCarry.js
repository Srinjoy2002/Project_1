import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../header';
import commonStyles from '../../../styles';

const TravelHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [travelData, setTravelData] = useState([]);


    const navigation = useNavigation();



  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        if (phoneNumber) {
          const response = await fetch(`http://192.168.1.4:5002/api/get-consignment/${phoneNumber}`);
          const data = await response.json();
          if (data.consignments) {
            setTravelData(data.consignments);
          }
        }
      } catch (error) {
        console.error("Error fetching travel data: ", error);
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
      onPress={() => navigation.navigate("ConsignmentCarryDetails", { ride: item })}
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
                         
                         <View style={[commonStyles.verticalseparator, { marginTop: -5,marginBottom:5 }]} >
                 
                         </View>
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



<View style={styles.otherInfo}>
                
                
                
                <View style={styles.infoBlock}>
                          <View style={[styles.infoRow, {marginTop:0}]}>
                
                        <Image source={require("../../../Images/weight.png")} style={[styles.locationIcon, { marginLeft:0 ,width:24,height:24,marginTop:-3}]} />
                            <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Weight</Text>
                            </View>
                            <Text style={[styles.infoSubtitle,{marginRight:20,marginLeft:-50,marginTop:5,fontSize:15,color:'black'}]}>{item.weight} Kg</Text>
                          </View>
          
                          
                          
                          
                        <View style={styles.infoBlock}>
                          <View style={[styles.infoRow, {marginTop:0}]}>
                
                        <Image source={require("../../../Images/dimension.png")} style={[styles.locationIcon, { marginLeft:0 ,width:24,height:24,marginTop:-3}]} />
                            <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Dimensions</Text>
                            </View>
                            <Text style={[styles.infoSubtitle,{marginRight:20,marginLeft:-50,marginTop:5,fontSize:15,color:'black'}]}>{item.dimensions.length}X{item.dimensions.breadth}X{item.dimensions.height}</Text>
                          </View>
          
          
                          
                         
                        </View>



                        {/* <View style={styles.separator1} /> */}

     

     
    
    
    
      
  
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header title="Consignments to carry" navigation={navigation} />


      {/* Search Bar Section */}
     

      {/* Travel History List */}
      <FlatList
        data={travelData.filter(item => item._id.includes(searchText))} // Filter based on search text
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
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
infoBlock: {
    alignItems: 'center',
  },
  otherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#555',
  },

});
