import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import RBSheet from "react-native-raw-bottom-sheet"; // Importing the Bottom Sheet library
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome Icon for calendar
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import ReviewDetails from '../../Customer Traveller/ReviewDetails';




const TravelDetails = () => {
  const navigation = useNavigation();

  // Create a reference for the bottom sheet
  const bottomSheetRef = useRef();

  // Initially, set the modal visibility to false to avoid it showing on the first enter
  const [isModalVisible, setModalVisible] = useState(false);
  const [travelMode, setTravelMode] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [searchingDate, setSearchingDate] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [receiverNumber, setReceiverNumber] = useState(null);
  const [parcelDetails, setParcelDetails] = useState(null);
  const [name, setName] = useState(null);
  const [number, setNumber] = useState(null);
  const [loading, setLoading] = useState(false);




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
        const startingLocation = await AsyncStorage.getItem('startingLocation');
        const goingLocation = await AsyncStorage.getItem('goingLocation');

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





  const handleCloseModal = () => {
    console.log("Modal is closing...");
    setModalVisible(false);
  };

  const handlePublishConsignment = async () => {
    setLoading(true);


    const updatedParcelDetails = {
        ...parcelDetails, // Spread existing parcel details
        dimensions: {
          ...parcelDetails.dimensions, // Spread existing dimensions
          unit: "cm", // Add new unit field
        },
      };

    // Construct API request payload
    const requestData = {
        startinglocation: startLocation,
        goinglocation: endLocation,
    //   travelMode,
    //   startTime,
    //   endTime,
    //   searchingDate,
      recievername: receiverName,
      recieverphone: receiverNumber,
      Description:parcelDetails.description,
      weight:parcelDetails.weight,
      category:parcelDetails.category,
    category:'nondocument',
    // "dimensions": {
    //     "length": 30,
    //     "breadth": 10,
    //     "height": 10,
    //     "unit": "cm"
    //   },
    //   handleWithCare:parcelDetails.handleWithCare,
    // dimensions:updatedParcelDetails,
    dimensions: {
        breadth: Number(parcelDetails.dimensions.breadth), 
        height: Number(parcelDetails.dimensions.height), 
        length: Number(parcelDetails.dimensions.length), 
        unit: "cm"  // Adding unit field
      },
      dateOfSending:searchingDate,
      durationAtEndPoint:parcelDetails.duration,
    //   specialRequest:parcelDetails.specialRequest,
    // images:[],
    //   parcelDetails, 
    //   senderName: name,
      phoneNumber: number,
    };


    console.log('requestData',requestData)

    try {
      const response = await fetch("http://192.168.31.66:5002/api/consignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        // Alert.alert("Success", "Your consignment request has been published!");
        navigation.navigate("PublishConsignmentRequestSentScreen");
      } else {
        Alert.alert("Error", data.message || "Something went wrong!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to publish consignment request.");
    } finally {
      setLoading(false);
    }
  };


  // Ensure the modal is not visible when the component first renders
  useEffect(() => {
    const fetchConsignmentData = async () => {
      try {
        const startingLocation = await AsyncStorage.getItem("startingLocation");
        const goingLocation = await AsyncStorage.getItem("goingLocation");
        const travelMode = await AsyncStorage.getItem("travelMode");
        const startTime = await AsyncStorage.getItem("startTime");
        const endTime = await AsyncStorage.getItem("endTime");
        const searchingDate = await AsyncStorage.getItem("searchingDate");
        const receiverName = await AsyncStorage.getItem("receiverName");
        const receiverNumber = await AsyncStorage.getItem("receiverNumber");
        const storedData = await AsyncStorage.getItem("parcelDetails");
        const name = await AsyncStorage.getItem("firstName");
        const number = await AsyncStorage.getItem("phoneNumber");

        setStartLocation(startingLocation);
        setEndLocation(goingLocation);
        setTravelMode(travelMode);
        setStartTime(startTime);
        setEndTime(endTime);
        setSearchingDate(searchingDate);
        setParcelDetails(storedData ? JSON.parse(storedData) : null);
        setReceiverName(receiverName);
        setReceiverNumber(receiverNumber);
        setName(name);
        setNumber(number);
      } catch (error) {
        console.error("Error fetching consignment data:", error);
      }
    };

    fetchConsignmentData();
  }, []);

  return (
    <View style={styles.container}>
   


      {/* Header */}
        <View style={styles.header}>
                  <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Parcel Details</Text>
                </View>

      <ScrollView >

      {/* Travel Info */}
        <View style={styles.card}>
             
             
            
                   
                    <View style={styles.locationRow}>
                                <Image source={require("../../Images/locon.png")} style={styles.locationIcon} />
                      
                                <Text style={styles.locationText}>
        {name}: {number}
        {'\n'}
        <Text style={styles.callNowText}>{startLocation}</Text>
      </Text>
                  
                    </View>
                    
                    <View style={styles.verticalseparator}>
            
                    </View>
                    <View style={styles.separator} />
                  
                    <View style={styles.locationRow}>
                       <Image source={require("../../Images/locend.png")} style={styles.locationIcon} />
                     
      
                       <Text style={styles.locationText}>
        {receiverName}: {receiverNumber}
        {'\n'}
        <Text style={styles.callNowText}>{endLocation}</Text>
      </Text>
      
                    </View>
            
                    <View style={[styles.separator1, {marginTop:30}]} />
            
            
                    {/* Travel Time and Distance */}
                    <View style={styles.infoRow}>
                    <Image source={require("../../Images/clock.png")} style={[styles.locationIcon, { marginLeft: 5 }]} />
                      <Text style={styles.infoText}>170kms</Text>
                    </View>
            
            
      
      
      
      
      
      
      
              {/* Distance */}
              
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
        <Text style={styles.sectionTitle}> Description of parcel</Text>
        <Text style={styles.parcelDescription}>
  {parcelDetails?.description || 'Loading...'}
</Text>

        <View style={styles.dottedLine} />
        {/* Weight & Dimensions */}
      
      
            <View style={styles.otherInfo}>
                      
                      
                      
            <View style={styles.infoBlock}>
                      <View style={[styles.infoRow, {marginTop:0}]}>
            
                    <Image source={require("../../Images/weight.png")} style={[styles.locationIcon, { marginLeft:0 ,width:24,height:24,marginTop:-3}]} />
                        <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Weight</Text>
                        </View>
                        <Text style={[styles.infoSubtitle,{marginRight:20,marginLeft:-50,marginTop:5,fontSize:15,color:'black'}]}>{parcelDetails?.weight || 'Loading...'} Kg</Text>
                      </View>
      
                      
                      
                      
                    <View style={styles.infoBlock}>
                      <View style={[styles.infoRow, {marginTop:0}]}>
            
                    <Image source={require("../../Images/dimension.png")} style={[styles.locationIcon, { marginLeft:0 ,width:24,height:24,marginTop:-3}]} />
                        <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Dimensions</Text>
                        </View>
                        <Text style={[styles.infoSubtitle, { marginRight: 20, marginLeft: -50, marginTop: 5, fontSize: 15, color: 'black' }]}>
  {parcelDetails?.dimensions 
    ? `${parcelDetails.dimensions.length} X ${parcelDetails.dimensions.breadth} X ${parcelDetails.dimensions.height}`
    : 'Loading...'}
</Text>

                      </View>
                     
                    </View>
       
       
       
       
        <View style={styles.dottedLine} />
        {/* Extra Information */}
        <View style={styles.extraInfo}>
          <Text style={styles.infoTitle} numberOfLines={1} >Handle with Care</Text>     
        </View>
        <View style={styles.extraInfo}> 
        <Text style={styles.extraValue} numberOfLines={1}>
  {parcelDetails?.handleWithCare ? 'Yes' : 'No'}
</Text>
        </View>
        <View style={styles.dottedLine} />
        <View style={styles.extraInfo}>
          <Text style={styles.infoTitle} numberOfLines={1}>Special Requests</Text>
        </View>
        <View style={styles.extraInfo}> 
          <Text style={styles.extraValue} numberOfLines={1} > {parcelDetails?.specialRequest || 'No'}</Text>
        </View>
        <View style={styles.dottedLine} />
      

        <View style={styles.otherInfo}>
                      
                      
                      
                      <View style={styles.infoBlock}>
                                <View style={[styles.infoRow, {marginTop:0}]}>
                      
                                  <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Date of Sending  {'\n'}</Text>
                                  </View>
                                  <Text style={[styles.infoSubtitle,{marginRight:20,marginLeft:0,marginTop:5,fontSize:15,color:'black'}]}>{parcelDetails?.date || 'Loading...'}</Text>
                                </View>
                
                                
                                
                                
                              <View style={styles.infoBlock}>
                                <View style={[styles.infoRow, {marginTop:0}]}>
                      
                                  <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Duration you will  {'\n'}be  at the end point</Text>
                                  </View>
                                  <Text style={[styles.infoSubtitle,{marginRight:20,marginLeft:0,marginTop:5,fontSize:15,color:'black'}]}>{parcelDetails?.duration || 'Loading...'}</Text>

          
                                </View>
                               
                              </View>

         
      </View>

       



      <View style={{margin:20,marginTop:-10}}>
      <TouchableOpacity style={styles.button} onPress={handlePublishConsignment} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Publish My Consignment</Text>}
      </TouchableOpacity>
    </View>
     

      {/* Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={500} // Height of the Bottom Sheet
        openDuration={250} // Animation duration
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}
      >
        <ReviewDetails /> {/* ReviewDetails component will be displayed inside the Bottom Sheet */}
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
    backgroundColor: '#FFFFFF',
    marginTop: 40,
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
    color: 'black',
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
    backgroundColor: '#D83F3F',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationText: {
    color: 'black',
    fontSize: 16,
    marginLeft:20,
    fontWeight:'bold'
  },
  callNowText:{
    color: 'black',
    fontSize: 14,
    marginLeft:20,
    marginTop:5,
    fontWeight:'light'


  },
  parcelDescription: {
    // width: 300,
    fontSize: 16,
    color: 'black',
    marginBottom: 12,
    marginLeft: 6
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  parcelDescription: {
    // width: 300,
    fontSize: 16,
    color: 'black',
    marginBottom: 12,
    marginLeft: 6
  },
 
  infoColumn: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  extraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0
    
  },
  extraValue: {
    color: 'black',
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerButton: {
    backgroundColor: '#53B175',
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    marginTop:10
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
  infoRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: 10,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 0.5,
    borderColor: '#aaa',
    marginVertical: 12,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
   
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
  
});
