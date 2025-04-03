import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons


const TravelMode = ({ navigation }) => {
  const [receivername, setreceivername] = useState('');
  const [receivernumber, setreceivernumber] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [useMyNumber, setUseMyNumber] = useState(false);


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




  useEffect(() => {
    const fetchUserPhoneNumber = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('phoneNumber');
        if (storedPhone) {
          setphoneNumber(storedPhone);
        }
      } catch (error) {
        console.error('Error fetching phone number:', error);
      }
    };

    fetchUserPhoneNumber();
  }, []);

  // Handle checkbox toggle
  const toggleUseMyNumber = () => {
    setUseMyNumber(!useMyNumber);
    if (!useMyNumber) {
      setreceivernumber(phoneNumber);
    } else {
      setreceivernumber('');
    }
  };

  // Function to save data in AsyncStorage
  const saveData = async () => {
    if (!receivername) {
      alert(`Please enter Receiver's Name.`);
      return;
    }
    if (!receivernumber) {
      alert(`Please enter Receiver's Number.`);
      return;
    }

    try {
      await AsyncStorage.setItem('receiverName', receivername.toString());
      await AsyncStorage.setItem('receiverNumber', receivernumber.toString());
      navigation.navigate('ParcelForm'); // Navigate after saving data
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
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
    
    
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              
              <View style={styles.header1}>
                  {/* <Icon name="arrow-left" style={{textAlign:'center',alignItems:'center',alignSelf: 'center',}} size={15} color="#fff" /> */}
                          <Ionicons name="chevron-back" style={{textAlign:'center',alignItems:'center',alignSelf: 'center',}} size={20} color="white" />
              
              </View>
              </TouchableOpacity>
    
    
      </MapView>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Receiver's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Receiver's Name"
          placeholderTextColor="#999"
          value={receivername}
          onChangeText={setreceivername}
        />

        <Text style={styles.label}>Receiver's Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Receiver's Mobile Number"
          placeholderTextColor="#999"
          value={receivernumber}
          onChangeText={setreceivernumber}
          keyboardType="phone-pad"
          returnKeyType="done"
        />

        {/* Checkbox for using stored phone number */}
        <TouchableOpacity style={styles.checkboxContainer} onPress={toggleUseMyNumber}>
          <Icon name={useMyNumber ? 'check-square' : 'square-o'} size={24} color="#53B175" />
          <Text style={styles.checkboxText}>Use my mobile number ({phoneNumber})</Text>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={saveData}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1.5 },
  detailsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    backgroundColor: 'white',
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#D83F3F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
header1: { position: 'absolute', top: 40, width: '13%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#D83F3F', padding: 15, borderRadius: 12, marginHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
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

export default TravelMode;
