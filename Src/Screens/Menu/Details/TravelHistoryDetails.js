import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import RBSheet from "react-native-raw-bottom-sheet"; // Importing the Bottom Sheet library
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import EarningDetails from '../../../Customer Traveller/EarningDetails';
import Header from "../../../header";
import commonStyles from "../../../styles";
const TravelDetails = (route) => {


  const ride = route.route.params.ride;
  console.log('ride', ride);// Retrieve data from navigation

// console.log('rotutes',ride.Leavinglocation)
  // console.log('item',item)

  const [travelMode, setTravelMode] = useState('');
  const [travelNumber, setTravelNumber] = useState(null);
  const [phoneNumber,setPhoneNumber] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchingDate, setSearchingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('completed');






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
        const startingLocation = ride.Leavinglocation;
        const goingLocation = ride.Goinglocation;

        if (startingLocation && goingLocation) {
          setStartLocation(startingLocation);
          setEndLocation(goingLocation);

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
        `http://192.168.1.4:5002/map/getdistanceandcoordinate?origin=${origin}&destination=${destination}`
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
        const startingLocation = ride.Leavinglocation;
        const goingLocation = ride.Goinglocation;
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



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // "1 Feb 2025"
  };


  


  const navigation = useNavigation();

  // Create a reference for the bottom sheet
  const bottomSheetRef = useRef();

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
    <EarningDetails
      onClose={() => setModalVisible(false)}
      onSearch={handleSearch}
    />
  </View>
  
</Modal>


      {/* Header */}
      <Header title="Travel Details" navigation={navigation} />

      <ScrollView >




      <View style={styles.card}>

   


{/* Travel Time and Distance */}
<View style={styles.infoRow}>
  <Text style={{fontSize:11,fontWeight:'bold',marginRight:10,marginTop:5}}>Travel ID {ride._id}</Text>
  {renderStatusBadge('UPCOMING')}
</View>

</View>



{status === 'upcoming' && (

<TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ConsignementCarry')}>

<View style={styles.card}>

   


{/* Travel Time and Distance */}

<View style={styles.infoRow}>
<Image source={require("../../../Images/package.png")} />


  <Text style={{fontSize:14,fontWeight:'bold',marginRight:10,marginTop:5,marginLeft:10}}>Consignment to Carry</Text>
  <Ionicons name="arrow-forward" size={24} color="black" style={{position:'absolute',right:0}} />
</View>

</View>

</TouchableOpacity>

)}


      {/* Travel Info */}
      <View style={styles.card}>

       
        <View style={styles.locationRow}>
                    <Image source={require("../../../Images/locon.png")} style={styles.locationIcon} />
          
          <Text style={styles.locationText}>{ride.Leavinglocation}</Text>
      
        </View>
        
        <View style={commonStyles.verticalseparator}>

        </View>
        <View style={commonStyles.separator} />
      
        <View style={styles.locationRow}>
           <Image source={require("../../../Images/locend.png")} style={styles.locationIcon} />
          <Text style={styles.locationText}>{ride.Goinglocation}</Text>
        </View>

        <View style={commonStyles.staraightSeparator} />


        {/* Travel Time and Distance */}
        <View style={styles.infoRow}>
        <Image source={require("../../../Images/clock.png")} style={[styles.locationIcon, { marginLeft: 5 }]} />
          <Text style={styles.infoText}>{ride.duration}</Text>
        </View>
        <Text style={styles.infoText1}>{ride.distance}</Text>

        </View>

        <View style={styles.mapContainer}>
        <Text style={[styles.infoTitle, { marginBottom: 20 }]}>Track on map</Text>
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

        <View style={styles.card}> 
        {/* Map */}
       
        {/* Other Information */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Other Information</Text>

            <View style={[styles.infoRow, {marginTop:20}]}>
        <Image source={require("../../../Images/clock.png")} style={[styles.locationIcon, { marginLeft:2 }]} />
          <Text style={styles.infoText}>{formatDate(ride.travelDate)}</Text>
        </View>
        <Text style={styles.infoText2}>{ride.expectedStartTime} - {ride.expectedEndTime}</Text>




          </View>
          
        </View>


        <View style={commonStyles.staraightSeparator} />


        {/* Vehicle Info */}
        <View style={styles.traveler}>



        <View style={styles.iconContainer}>{getTravelIcon(ride.travelMode)}</View>

<View style={styles.travelerDetails}>
  <Text style={[styles.travelerName, { marginLeft: 15 }]}>{ride.travelMode}</Text>
  <Text style={[styles.travelerName, { marginLeft: 15 }]}>{ride.travelmode_number}</Text>

</View>
</View>


       



       
      </View>


      {status === 'completed' && (



      <View style={styles.card}>

   


{/* Travel Time and Distance */}
<TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ConsignementCarry')}>

<View style={styles.infoRow}>
<Image source={require("../../../Images/package.png")} />

  <Text style={{fontSize:14,fontWeight:'bold',marginRight:10,marginTop:5,marginLeft:10}}>Consignment to Carry</Text>
  <Ionicons name="arrow-forward" size={24} color="black" style={{position:'absolute',right:0}} />

</View>

</TouchableOpacity>


<View style={commonStyles.staraightSeparator} />


<TouchableOpacity onPress={() => bottomSheetRef.current.open()}>

<View style={styles.infoRow}>
<Image source={require("../../../Images/Earnings.png")} />

           // Trigger bottom sheet on press
  <Text style={{fontSize:14,fontWeight:'bold',marginRight:10,marginTop:5,marginLeft:10}}>Earnings</Text>
  <Ionicons name="arrow-forward" size={24} color="black" style={{position:'absolute',right:0}} />
</View>
</TouchableOpacity>


</View>
  )}



{status !== 'completed' && status !== 'cancelled' && (

        <View style={{margin:20,marginTop:-10}}> 
     
           <TouchableOpacity
               style={styles.button}
               onPress={() => navigation.navigate('Cancellation')} // Trigger bottom sheet on press
             >
               <Text style={styles.buttonText}>Cancel Ride</Text>
             </TouchableOpacity>
           </View>
    )} 

      {/* Bottom Sheet */}


      <RBSheet
        ref={bottomSheetRef}
        height={300} // Height of the Bottom Sheet
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
        <EarningDetails earning = {ride.expectedearning} id={ride.rideId}  /> {/* ReviewDetails component will be displayed inside the Bottom Sheet */}
      </RBSheet>
     
      </ScrollView>
    </View>
  );
};

export default TravelDetails;

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
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
    marginLeft:10
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
    marginLeft:0,
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
  
  
});
