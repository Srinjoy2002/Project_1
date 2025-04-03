// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
// import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Location from 'expo-location'; // Import Expo Location
// import axios from 'axios'; // Import axios for API calls
// import MapView from 'react-native-maps';

// const SearchDeliveryScreen = ({ onSearch, initialValues }) => {
  
//   const [from, setFrom] = useState(initialValues?.from || '');
//   const [to, setTo] = useState(initialValues?.to || '');
//   const [date, setDate] = useState(initialValues?.date || '');
//   const [showPicker, setShowPicker] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === 'granted') {
//         let location = await Location.getCurrentPositionAsync({});
//         setCurrentLocation(location);
//         const address = await Location.reverseGeocodeAsync(location.coords);
//         setFrom(address[0].formatted_address); // Set current address
//       }
//     })();
//   }, []);

//   const fetchSuggestions = async (query) => {
//     if (query) {
//       const response = await axios.get(`https://maps.googleapis.com/maps/api/js?key=INSERT_YOUR_API_KEY&libraries=places`, {
//         params: {
//           input: query,
//           key: 'AIzaSyC0o_QEaAIILcOPnTSOgLLmkPlavSi-bJY',
//         },
//       });
//       setSuggestions(response.data.predictions);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* From Input */}
//       <Text style={styles.label}>From</Text>
//       <View style={styles.inputContainer}>
//         <TextInput 
//           style={styles.input} 
//           placeholder="Enter location" 
//           value={from} 
//           onChangeText={(text) => {
//             setFrom(text);
//             fetchSuggestions(text); // Fetch suggestions
//           }}
//         />
//         <FontAwesome name="search" size={20} color="#ccc" style={styles.icon} />
//       </View>
//       <FlatList
//         data={suggestions}
//         keyExtractor={(item) => item.place_id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => setFrom(item.description)}>
//             <Text>{item.description}</Text>
//           </TouchableOpacity>
//         )}
//       />

//       {/* To Input */}
//       <Text style={styles.label}>To</Text>
//       <View style={styles.inputContainer}>
//         <TextInput 
//           style={styles.input} 
//           placeholder="Enter location" 
//           value={to} 
//           onChangeText={setTo}
//         />
//         <FontAwesome name="search" size={20} color="#ccc" style={styles.icon} />
//       </View>

//       {/* Current Location Button */}
//       <TouchableOpacity onPress={() => {
//         if (currentLocation) {
//           setFrom(`Lat: ${currentLocation.coords.latitude}, Lon: ${currentLocation.coords.longitude}`);
//         }
//       }}>
//         <Text style={styles.currentLocationText}>Use Current Location</Text>
//       </TouchableOpacity>

//       {/* Date Picker */}
//       <Text style={styles.label}>Date of delivery</Text>
//       <TouchableOpacity onPress={() => setShowPicker(true)}>
//         <View style={styles.inputContainer}>
//          <Text style={styles.dateText}>
//            {date ? new Date(date).toDateString() : 'No Date Selected'}
//          </Text>
//           <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#ccc" style={styles.icon} />
//         </View>
//       </TouchableOpacity>
//       {showPicker && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display="default"
//           onChange={onChange}
//         />
//       )}

//       {/* Search Button */}
//       <TouchableOpacity
//         style={styles.searchButton}
//         onPress={() => {
//           onSearch(); // Close the bottom sheet and navigate
//         }}
//       >
//         <Text style={styles.searchText}>Search</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // ... existing styles
//   currentLocationText: {
//     color: '#D93E3E',
//     fontSize: 16,
//     marginBottom: 20,
//   },
// });

// export default SearchDeliveryScreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
// import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Location from 'expo-location';
// import axios from 'axios';
// import MapView, { Marker } from 'react-native-maps'; // Import Marker from react-native-maps

// const SearchDeliveryScreen = ({ onSearch, initialValues }) => {
//   const [from, setFrom] = useState(initialValues?.from || '');
//   const [to, setTo] = useState(initialValues?.to || '');
//   const [date, setDate] = useState(initialValues?.date || '');
//   const [showPicker, setShowPicker] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [region, setRegion] = useState(null); // State for map region

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === 'granted') {
//         let location = await Location.getCurrentPositionAsync({});
//         setCurrentLocation(location);
//         setRegion({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         });
//         const address = await Location.reverseGeocodeAsync(location.coords);
//         setFrom(address[0].formatted_address); // Set current address
//       }
//     })();
//   }, []);

//   const fetchSuggestions = async (query) => {
//     if (query) {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
//         {
//           params: {
//             input: query,
//             key: 'AIzaSyC0o_QEaAIILcOPnTSOgLLmkPlavSi-bJY',
//           },
//         }
//       );
//       setSuggestions(response.data.predictions);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* From Input */}
//       <Text style={styles.label}>From</Text>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter location"
//           value={from}
//           onChangeText={(text) => {
//             setFrom(text);
//             fetchSuggestions(text); // Fetch suggestions
//           }}
//         />
//         <FontAwesome name="search" size={20} color="#ccc" style={styles.icon} />
//       </View>
//       <FlatList
//         data={suggestions}
//         keyExtractor={(item) => item.place_id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => {
//               setFrom(item.description);
//               setSuggestions([]);
//             }}
//           >
//             <Text>{item.description}</Text>
//           </TouchableOpacity>
//         )}
//       />

//       {/* MapView */}
//       {region && (
//         <MapView
//             style={styles.map}
//             region={{
//               latitude: currentLocation?.coords.latitude || 37.78825,
//               longitude: currentLocation?.coords.longitude || -122.4324,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}
//           >
//             {currentLocation && (
//               <Marker
//                 coordinate={{
//                   latitude: currentLocation.coords.latitude,
//                   longitude: currentLocation.coords.longitude,
//                 }}
//                 title="Current Location"
//               />
//             )}
//           </MapView>

//       )}

//       {/* Other inputs */}
//       <Text style={styles.label}>To</Text>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter location"
//           value={to}
//           onChangeText={setTo}
//         />
//         <FontAwesome name="search" size={20} color="#ccc" style={styles.icon} />
//       </View>

//       <TouchableOpacity
//         style={styles.searchButton}
//         onPress={() => {
//           onSearch(); // Pass data back to the parent
//         }}
//       >
//         <Text style={styles.searchText}>Search</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     fontSize: 16,
//   },
//   icon: {
//     marginLeft: 10,
//   },
//   map: {
//     height: 200,
//     marginVertical: 15,
//   },
//   searchButton: {
//     backgroundColor: '#D93E3E',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   searchText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default SearchDeliveryScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SearchDeliveryScreen = ({ onSearch, initialValues }) => {
  const [from, setFrom] = useState(initialValues?.from || '');
  const [to, setTo] = useState(initialValues?.to || '');
  const [date, setDate] = useState(initialValues?.date || '');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* From Section */}
      <Text style={styles.label}>From</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons name="place" size={20} color="#4CAF50" />
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          placeholderTextColor="#aaa"
          value={from}
          onChangeText={setFrom}
        />
      </View>

      {/* To Section */}
      <Text style={styles.label}>To</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons name="place" size={20} color="red" />
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          placeholderTextColor="#aaa"
          value={to}
          onChangeText={setTo}
        />
      </View>

     <Text style={styles.label}>Date of Delivery</Text>
       <View style={styles.inputContainer}>
       <MaterialIcons name="calendar-today" size={20} color="gray" />
         <Text style={styles.inputDate}>
           {date ? new Date(date).toDateString() : 'No Date Selected'}
         </Text>
       </View>

      {/* Result Card */}
      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 320,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    marginTop: 0,
  },
  inputDate: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    marginTop: 25,
  },
  card: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  cardSubtextTime: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchDeliveryScreen;
