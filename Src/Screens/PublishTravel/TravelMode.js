import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons


const TravelMode = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState('car');
  const [travelNumber, setTravelNumber] = useState('');
  const [travelDate, setTravelDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
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


  // Define mode-specific labels
  const modeLabels = {
    car: 'Car Number',
    airplane: 'Flight Number',
    train: 'Train Number',
  };



  


  const selectedItem = {
    title: 'Selected item title',
    description: 'Secondary long descriptive text ...',
  };
  


  const handleValueChange = (value) => {
    console.log(value)
    if (value!='null') {
      setSelectedMode(value);
    } else {
      alert("Please select a valid option.");
    }
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setTravelDate(currentDate); // Store formatted date
  };

  // Function to save data in AsyncStorage
  const saveData = async () => {

  

    if (!travelNumber.trim()) {
      alert(`Please enter ${modeLabels[selectedMode]}.`);
      return;
    }
    if (!travelDate) {
      alert('Please select a travel date.');
      return;
    }
    if (!startTime.trim()) {
      alert('Please enter the start time.');
      return;
    }
    if (!endTime.trim()) {
      alert('Please enter the end time.');
      return;
    }

    try {
     

      AsyncStorage.setItem('travelMode', selectedMode.toString());
      AsyncStorage.setItem('travelNumber', travelNumber.toString());
      AsyncStorage.setItem('searchingDate', travelDate.toISOString());
      AsyncStorage.setItem('startTime', startTime.toString());
      AsyncStorage.setItem('endTime', endTime.toString());


      // await AsyncStorage.setItem('travelDetails', JSON.stringify(travelDetails));
      navigation.navigate('PublishTravelDetails'); // Navigate after saving data
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        const storedDate = await AsyncStorage.getItem("searchingDate");
        
        // Convert stored strings back to objects
       
        if (storedDate) {
          setTravelDate(new Date(storedDate));
        }
      } catch (error) {
        console.log("Error retrieving travel data:", error);
      }
    };

    fetchTravelData();
  }, []); // Runs once when the component mounts





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
        {/* Mode of Travel */}
        <Text style={styles.label}>Mode of Travel</Text>
        <View style={styles.input}>

        <RNPickerSelect
       onValueChange={handleValueChange}
      items={[
        { label: 'Hatchback Car (4 seater)', value: 'car' },
        { label: 'Airplane', value: 'airplane' },
        { label: 'Train', value: 'train' },
      ]}
     
    >
      
{/* <Text></Text> */}
<Text>{selectedMode ? selectedMode : "Please select a mode"}</Text>
      </RNPickerSelect>


          {/* <Picker selectedValue={selectedMode} onValueChange={setSelectedMode} style={styles.picker}>
            <Picker.Item label="Hatchback Car (4 seater)" value="car" />
            <Picker.Item label="Airplane" value="airplane" />
            <Picker.Item label="Train" value="train" />
          </Picker> */}
        </View>

        {/* Dynamic Travel Number Label */}
        <Text style={styles.label}>{modeLabels[selectedMode]}</Text>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${modeLabels[selectedMode]}`}
          placeholderTextColor="#999"
          value={travelNumber}
          onChangeText={setTravelNumber}
        />

        {/* Date of Travel */}
        <Text style={styles.label}>Select the date when you are traveling</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.inputText}>{travelDate ? travelDate.toDateString() : 'Select Date'}</Text>
          </TouchableOpacity>
          <Icon name="calendar" size={20} color="#aaa" style={styles.calendarIcon} />
        </View>

        {/* Start & End Time */}
        <Text style={styles.label}>Select the start & end time of your journey</Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="Start Time (e.g. 8:30 AM)"
            placeholderTextColor="#999"
            value={startTime}
            onChangeText={setStartTime}
          />
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="End Time (e.g. 8:00 PM)"
            placeholderTextColor="#999"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={saveData}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
  <DateTimePicker
    value={date}
    mode="date"
    display="default"
    onChange={onChange}
    minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Set minimum date to day after tomorrow
  />
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 2.5 },
  detailsContainer: {
    flex: 3,
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8 },
  // pickerContainer: {
  //   // borderWidth: 1,
  //   borderColor: '#ddd',
  //   borderRadius: 8,
  //   backgroundColor: '#fff',
  //   overflow: 'hidden',
  //   // marginBottom: 16,
  // },
  // picker: {
  //   height: Platform.OS === 'ios' ? 150 : 50,
  //   color: '#333',
  // },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  calendarIcon: {
    position: 'absolute',
    right: 15,
    bottom: 25,
  },

  picker:{
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    backgroundColor: 'red',
    width: '100%',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  timeInput: { flex: 1, marginRight: 8 },
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
