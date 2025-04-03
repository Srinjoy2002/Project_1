import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import RatingDetails from '../../../Customer Traveller/RatingDetails';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet"; // Importing the Bottom Sheet library
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from "../../../styles";
import Header from "../../../header";
const TravelDetails = (route) => {


  const ride = route.route.params.ride;
  console.log('ride', ride);// Retrieve data from navigation
  const bottomSheetRef = useRef();


  

// console.log('rotutes',ride.Leavinglocation)
  // console.log('item',item)

  const [travelMode, setTravelMode] = useState('');
  const [travelNumber, setTravelNumber] = useState(null);
  const [phoneNumber,setPhoneNumber] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchingDate, setSearchingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Yet To Start');
  const [rideStatus, setRideStatus] = useState([]);






  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const startingLocation = ride.startinglocation;
        const goingLocation = ride.goinglocation;

        if (startingLocation && goingLocation) {
          setStartLocation(startingLocation);
          setEndLocation(goingLocation);


          if(ride.status == 'completed' && ride.isrationg != 'done'){
            bottomSheetRef.current.open();
        
          }

          // Fetch coordinates and route in parallel
          await Promise.all([
            fetchCoordinates(startingLocation, goingLocation),
            fetchRoute(startingLocation, goingLocation),
          ]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const fetchRoute = async (origin, destination) => {
    try {
      const GOOGLE_MAPS_API_KEY = 'AIzaSyC0o_QEaAIILcOPnTSOgLLmkPlavSi-bJY'; // Replace with your API key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedCoordinates = decodePolyline(points);
        await AsyncStorage.setItem('DecodedPolyLine', JSON.stringify(decodedCoordinates));
        setCoordinates(decodedCoordinates);
      } else {
        throw new Error('No routes found');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const fetchCoordinates = async (origin, destination) => {
    try {
      const response = await fetch(
        `http://192.168.31.66:5002/map/getdistanceandcoordinate?origin=${origin}&destination=${destination}`
      );
      const data = await response.json();
      if (data.originCoordinates && data.destinationCoordinates) {
        setOriginCoords({
          latitude: data.originCoordinates.ltd,
          longitude: data.originCoordinates.lng,
        });
        setDestinationCoords({
          latitude: data.destinationCoordinates.ltd,
          longitude: data.destinationCoordinates.lng,
        });
        await AsyncStorage.setItem('setOriginCoords', JSON.stringify(originCoords));
await AsyncStorage.setItem('setDestinationCoords', JSON.stringify(destinationCoords));

        setDistance(data.distance);
        setDuration(data.duration);
      } else {
        throw new Error('Invalid coordinates data');
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
      Alert.alert('Error', 'Failed to fetch route data. Please try again.');
    }
  };

  useEffect(() => {
    if (originCoords) {
      // console.log("Origin Coordinates:", originCoords);
    }
  }, [originCoords]);

  useEffect(() => {
    if (destinationCoords) {
      // console.log("Destination Coordinates:", destinationCoords);
    }
  }, [destinationCoords]);

  useEffect(() => {
    if (coordinates.length > 1) {
      // console.log("Updating polyline with coordinates:", coordinates);
    }
  }, [coordinates]);




 const getTravelIcon = (travelMode) => {
  // alert(travelMode)
    switch (travelMode) {
      case 'car':
        return <Icon name="car" size={30} color="#D83F3F" />;
      case 'airplane':
        return <Ionicons name="airplane" size={30} color="#D83F3F" />;
      case 'train':
        return <Icon name="train" size={30} color="#D83F3F" />;
      default:
        return <Ionicons name="help-circle-outline" size={30} color="gray" />; // Default icon
    }
  };

  useEffect(() => {
    const fetchTravelData = async () => {
      try {
          const startingLocation = ride.startinglocation;
        const goingLocation = ride.goinglocation;
        const travelMode = await AsyncStorage.getItem("travelMode");
        const travelNumber = await AsyncStorage.getItem("travelNumber");
        const startTime = await AsyncStorage.getItem("startTime");
        const endTime = await AsyncStorage.getItem("endTime");
        const searchingDate = await AsyncStorage.getItem("searchingDate");
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");


        setStartLocation(startingLocation);
        setEndLocation(goingLocation);
        setTravelMode(travelMode);
        setTravelNumber(travelNumber);
        setStartTime(startTime);
        setEndTime(endTime);
        setPhoneNumber(phoneNumber)
        setSearchingDate(searchingDate);
      } catch (error) {
        console.error("Error fetching travel data:", error);
      }
    };

    fetchTravelData();
  }, []);



   useEffect(() => {
      fetch("http://192.168.31.66:5002/map/consignment-status")
        .then((res) => res.json())
        .then((data) => {
          setRideStatus(data.status); // Corrected this
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // "1 Feb 2025"
  };


  


  const navigation = useNavigation();

  // Create a reference for the bottom sheet

  // Initially, set the modal visibility to false to avoid it showing on the first enter
  const [isModalVisible, setModalVisible] = useState(false);


  const handleCloseModal = () => {
    console.log("Modal is closing...");
    setModalVisible(false);
  };



  const handleSearch = () => {
    console.log("Search button pressed");
    setModalVisible(false); // Close modal on search
    navigation.navigate("TravelDetails");
  };

  // Ensure the modal is not visible when the component first renders
  useEffect(() => {
    // Optionally you can trigger the modal based on user action if needed
    // For example, you could show the modal after a timeout or when user clicks a specific button
  }, []);


    const renderStatusBadge = (status) => {
      const colors = {
        UPCOMING: '#FFD700',
        CANCELLED: '#FF6347',
        COMPLETED: '#32CD32',
      };
  
      return (
        <View style={[styles.badge, { backgroundColor: colors[status] }]} >
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      );
    };

  return (
    <View style={styles.container}>
   <Modal
  visible={isModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>

<View style={styles.modalContainer}>
    <RatingDetails
      onClose={() => setModalVisible(false)}
      onSearch={handleSearch}
    />
  </View>
  
</Modal>


      {/* Header */}
      <Header title="Track Your Consignment" navigation={navigation} />


      <ScrollView >





      <View style={styles.mapContainer}>
       
        <MapView
      key={coordinates.length} 

        style={styles.map}
        initialRegion={{
          latitude: originCoords && coordinates.length > 1 ? originCoords.latitude : 28,
          longitude: originCoords && coordinates.length > 1 ? originCoords.longitude : 77,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
                                       <Polyline coordinates={coordinates} strokeColor="blue" strokeWidth={5} />
                       
        
        
         {originCoords && (
                 <Marker coordinate={originCoords} title={startLocation}>
                   <View style={[styles.marker, styles.startMarker]}>
                     {/* <Text style={styles.markerText}>{startLocation}</Text> */}
                     <Icon name="user" size={25} color="#fff" />
       
                   </View>
                 </Marker>
               )}
       
               {destinationCoords && (
                 <Marker coordinate={destinationCoords} title={endLocation}>
                   <View style={[styles.marker, styles.endMarker]}>
                     {/* <Text style={styles.markerText}>{endLocation}</Text> */}
                                                <Icon name="map-marker" size={25} color="#fff" />
                     
                   </View>
                 </Marker>
               )}

               </MapView> 
        </View>


      <View style={styles.card1}>

   


{/* Travel Time and Distance */}
<View style={styles.infoRow}>
  <Text style={{fontSize:20,fontWeight:'bold',marginRight:10,marginTop:5}}>{status}</Text>

  {status === 'Yet To Start' && (

  <View style={styles.greenBox}>
  <Text style={{fontSize:20,fontWeight:'bold',color:'white',letterSpacing:5}}>2020</Text>
  </View>
  )}
</View>

</View>





      {/* Travel Info */}
      <View style={styles.card1}>

       
        <View style={styles.locationRow}>
                    <Image source={require("../../../Images/locon.png")} style={styles.locationIcon} />
          
          <Text style={styles.locationText}>{ride.startinglocation} {'\n'}

          <Text style={styles.innerlocationText}>(Pickup : 8:49pm)</Text>


          </Text>
          
      
        </View>
        
        <View style={commonStyles.verticalseparator}>

        </View>
        <View style={commonStyles.separator} />
      
        <View style={styles.locationRow}>
           <Image source={require("../../../Images/locend.png")} style={styles.locationIcon} />
          
           <Text style={styles.locationText}>{ride.goinglocation} {'\n'}

          <Text style={styles.innerlocationText}>(Estimated Drop : 9:49pm)</Text>


          </Text>
        </View>



        {/* Travel Time and Distance */}
    
    
        </View>

     

        <View style={styles.card}> 
        {/* Map */}


      
        <Text style={styles.infoTitle}>Traveler Details</Text>


        <View style={styles.traveler}>



          <Image
            source={{
              uri: 'https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg', // Replace with traveler image if available
            }}
            style={styles.profileImage}
          />
          <View style={styles.travelerDetails}>
            <Text style={styles.travelerName}>{ride.username}</Text>
            <Text style={styles.travelerRating}>⭐ 4.8 (247 ratings)</Text>
          </View>
        </View>




      

        {ride.travelMode && (
  <>
    <View style={commonStyles.staraightSeparator} />

    <View style={styles.traveler}>
      <View style={styles.iconContainer}>{getTravelIcon(ride.travelMode)}</View>

      <View style={styles.travelerDetails}>
        <Text style={[styles.travelerName, { marginLeft: 15 }]}>{ride.travelMode}</Text>
        {ride.travelmode_number && (
          <Text style={[styles.travelerName, { marginLeft: 15 }]}>{ride.travelmode_number}</Text>
        )}
      </View>
    </View>
  </>
)}



<View style={commonStyles.staraightSeparator} />

       
        {/* Other Information */}
        <View style={styles.otherInfo}>
          <View style={styles.infoBlock}>



            

            <View style={[styles.infoRow, {marginTop:20}]}>
            <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: "#53B175" },
                      ]}
                    >
            
            <Icon name="phone" size={15} color="white" />
            </View>
          <Text style={styles.phoneNumber}>{ride.phoneNumber}</Text>
        </View>




          </View>
          
        </View>




        {/* Vehicle Info */}
      


       



       
      </View>


    


      {status != 'Yet To Start' && (


 <View style={styles.card}>
  {rideStatus.map((item, index) => (
    <View key={index}>
      <View style={styles.locationRow}>
        {/* Icon with Conditional Color */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.completed ? "#0B8043" : "#EAB308" },
          ]}
        >
          {item.completed ? (
            <Icon name="check" size={15} color="white" />
          ) : (
            <Ionicons name="time-outline" size={20} color="white" />
          )}
        </View>

        {/* Status Text */}

        <Text style={styles.locationText}>{item.step}</Text>
<Text style={styles.callNowText}>{item.updatedat}</Text>
      </View>

      {/* Render Separator only if not the last item */}
      {index !== rideStatus.length - 1 && <View style={[commonStyles.verticalseparator, { marginTop: 5 ,marginLeft:8}]} />}
    </View>
  ))}
</View>

      )}


      {/* Bottom Sheet */}


      <RBSheet
        ref={bottomSheetRef}
        height={700} // Height of the Bottom Sheet
        openDuration={250} // Animation duration
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}
      >
        "_id": "67a06c4a8f81ca30f5ede95e",
        <RatingDetails earning = {ride.expectedearning} id={ride.rideId}  /> {/* ReviewDetails component will be displayed inside the Bottom Sheet */}
      </RBSheet>
     
      </ScrollView>
    </View>
  );
};

export default TravelDetails;

const styles = StyleSheet.create({
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Makes the header title take up all available space
    textAlign: 'center', // Centers the title
  },
  backButton: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 20,
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
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 4,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  card1: {
    backgroundColor: 'transparent',
    // margin: 20,
    borderRadius: 4,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft:10,
    fontWeight:'bold'
  },
  innerlocationText: {
    fontSize: 16,
    color: '#333',
    marginLeft:10,
    fontWeight:'regular'
  },
  separator1: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
    marginLeft:5
  },
  separator: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    marginLeft: 40,
    marginTop:-20
  },
  verticalseparator: {
    width: 1, // Set width to 1 for a thin line
    backgroundColor: '#ddd', // Make the background transparent
    borderStyle: 'dashed', // Dotted border style
    borderLeftWidth: 1, // Add left border to simulate a vertical line
    borderLeftColor: '#ddd', // Set the color for the dotted line
    height: '40', // Set height to 100% or any specific height you need
    marginHorizontal: 11, // Optional: add horizontal spacing if needed
    marginTop:5
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
  phoneNumber: {
    fontSize: 14,
    color: 'black',
    fontWeight:'bold',
    marginLeft:10,
    marginTop:5
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
    // margin: 20,
    
  },
  map: {
    width: '100%',
    height: 400,
    // borderRadius: 10,
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
    marginBottom:10
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
  button: {
    backgroundColor: 'transparent',  // Transparent background
    borderWidth: 2,                  // Border outline
    borderColor: '#D83F3F',          // Border color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#D83F3F',
    fontSize: 16,
    fontWeight: 'bold',
  },

  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startMarker: {
    backgroundColor: 'green',
  },
  endMarker: {
    backgroundColor: 'red',
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

  greenBox: {
    backgroundColor: '#53B175', // Green background for the box
    paddingVertical: 5,        // Vertical padding for the box
    paddingHorizontal: 15,     // Horizontal padding for the box
    borderRadius: 8,          // Optional: Rounded corners for the box
    position: 'absolute',     // Position it absolutely (adjust according to your layout)
    right: 10,                // Adjust the positioning as needed
    top: 0,                   // Adjust top or bottom as needed
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  callNowText:{
    color: 'black',
    fontSize: 16,
    // marginLeft:20,
    // marginTop:5,
    position:'absolute',
    left:40,
    top:25,
    fontWeight:'light'


  },
  
});
