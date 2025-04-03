import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ConsignmentSearchScreen = ({ onSearch, initialValues }) => {
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

     <Text style={styles.label}>Date of Sending</Text>
       <View style={styles.inputContainer}>
       <MaterialIcons name="calendar-today" size={20} color="gray" />
         <Text style={styles.inputDate}>
           {date ? new Date(date).toDateString() : 'No Date Selected'}
         </Text>
       </View>

      {/* Result Card */}

      <Text style={styles.label}>Select your consignment</Text>


      <View style={styles.card}>
        
    


        {/* start here */}



       
<View style={styles.locationRow}>
            <Image source={require("../Images/locon.png")} style={styles.locationIcon} />
  
  <Text style={styles.locationText}>{from || 'Not Provided'}</Text>

</View>

<View style={styles.verticalseparator}>

</View>
<View style={styles.separator} />

<View style={styles.locationRow}>
   <Image source={require("../Images/locend.png")} style={styles.locationIcon} />
  <Text style={styles.locationText}>{to || 'Not Provided'}</Text>
</View>

<View style={styles.separator1} />


{/* Travel Time and Distance */}



{/* ends here */}



        <Text style={styles.cardTitle}>Date & Time of Sending (Expected)</Text>
        <Text style={styles.cardSubtext}>
          {date ? new Date(date).toDateString() : 'No Date Selected'}
        </Text>
      </View>

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
    marginTop: 35,
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


  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    marginTop:10
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



});

export default ConsignmentSearchScreen;
