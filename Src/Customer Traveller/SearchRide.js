import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import ConsignmentSearchScreen from "./ConsignmentSearchScreen";


const SearchRide = ({ navigation, route  }) => {
  const [data, setData] = useState([]); // Fetched backend data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalVisible, setModalVisible] = useState(true);
  const [dates, setDates] = useState([]);
  
  const { from, to, date } = route.params; // Retrieve data from navigation
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };
 
  const [selectedDate, setSelectedDate] = useState(formatDate(date)); // Ensure initial format is correct
  
  // Format date to YYYY-MM-DD

  
  // Fetch backend data dynamically
  const fetchData = useCallback(async (dateParam) => {
    if (!dateParam) return; // Ensure date is available before calling API
  
    try {
      setLoading(true);
  
      console.log("Fetching data for:", { from, to, date: dateParam });
      AsyncStorage.setItem('startingLocation',from.toString())
      AsyncStorage.setItem('goingLocation',to.toString())
      AsyncStorage.setItem('searchingDate',date.toString())
  


      const response = await axios.get(
        `http://192.168.1.4:5002/t/search-rides?leavingLocation=${from}&goingLocation=${to}&date=${dateParam}`,
        { headers: { "Content-Type": "application/json" } }
      );
  
      setData(response.data); // Assuming response.data is the list of travel details
      setError(null); // Reset error state on success
    } catch (err) {
      console.error("Error fetching travel details:", err.response?.data || err.message);
      setError("No rides found for the given date");
    } finally {
      setLoading(false);
    }
  }, [from, to]);
  
  // Generate next 5 days dynamically from the passed date
  useEffect(() => {
    if (!date) return; 
  
    const generateDatesFromPassedDate = (startDate) => {
      const nextFiveDays = [];
      const start = new Date(startDate); 
  
      for (let i = 0; i < 5; i++) {
        const futureDate = new Date(start);
        futureDate.setDate(start.getDate() + i);
        nextFiveDays.push(
          `${futureDate.getDate().toString().padStart(2, "0")}/${(futureDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${futureDate.getFullYear()}`
        );
      }
      return nextFiveDays;
    };
  
    const nextDates = generateDatesFromPassedDate(date);
    setDates(nextDates);
    setSelectedDate(nextDates[0]); // Ensure only the formatted date is set
  
  }, [date]);
  
  // Fetch data only when selectedDate is updated
  useEffect(() => {
    if (selectedDate) {
      fetchData(formatDate(selectedDate));
    }
  }, [selectedDate, fetchData]);
  
  const handleSearch = () => {
    console.log("Search button pressed");
    setModalVisible(false);
    fetchData(formatDate(selectedDate)); // Fetch again only when search button is pressed
  };




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
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("TravelDetails", { ride: item })}
    >



{/* start here */}

<View style={styles.locationRow}>
                    
                    <Text style={{fontWeight:"light",color:'black',fontSize:12}}>{item.expectedStartTime}</Text>
                    <Image source={require("../Images/locon.png")} style={[styles.locationIcon,{marginLeft:18}]} />
          
          <Text style={styles.locationText}>{from}</Text>
          
      
        </View>
        
        <View style={styles.locationRow}>

        <Text style={{ color: '#888', fontWeight: 'bold' }}>
  {item.duration ? item.duration.replace(' hours', 'hr').replace(' mins', '') : null}
</Text>

        <View style={styles.verticalseparator}/>

</View>

        
        <View style={styles.separator} />
      
        <View style={styles.locationRow}>
        <Text style={{color:'#black',fontSize:12}}>{item.expectedEndTime}</Text>

           <Image source={require("../Images/locend.png")} style={[styles.locationIcon,{marginLeft:20}]} />
          <Text style={styles.locationText}>{to}</Text>
        </View>


{/* start end */}
    
      {/* Time and Duration Section */}
      
  
   
      {/* Location and Route Section */}
      <View style={styles.locationSection}>
        {/* Starting Location */}
        

        
      
  
       
      
      </View>

              <View style={styles.separator1} />
      
  
      {/* Separator */}
  
      {/* Mode of Travel Section */}
      <View style={styles.modeOfTravel}>
        <Text style={styles.modeOfTravelLabel}>Mode of Travel</Text>
      </View>
  

      <View style={styles.driverSection}>
             <View style={styles.iconContainer}>{getTravelIcon(item.travelMode)}</View>
     
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>{item.travelMode}</Text>
        </View>
      </View>

              <View style={styles.separator1} />
      

      {/* Driver and Pricing Section */}
      <View style={styles.driverSection}>
        <Image source={{ uri: 'https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg'}} style={styles.driverPhoto} />
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>{item.username}</Text>
          <Text style={styles.driverRating}>⭐ {item.rating} ({item.totalRatings} ratings)</Text>
        </View>
        <Text style={styles.price}>₹{item.expectedearning}</Text>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ConsignmentSearchScreen
            onSearch={handleSearch}
            initialValues={{ from, to, date }}
          />
        </View>
      </Modal>

      <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                          <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Search a Traveller</Text>
                      </View>

      <ScrollView>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="black" />
          <TextInput style={styles.searchInput} placeholder={`${from} → ${to} ${selectedDate}`} placeholderTextColor="black" />
          <Ionicons name="options" size={24} color="black" />
        </View>

        {/* Date Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date}
              style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>{date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Data Section */}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>{error}</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id} // Use unique id
            renderItem={renderItem}
            contentContainerStyle={styles.rideList}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 40 },
  modalContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#D83F3F" },
  backIcon: { marginRight: 10, color: "#fff" },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  content: { flex: 1 },
  searchContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#e8e8e8", borderRadius: 10, margin: 10 },
  searchInput: { flex: 1, marginLeft: 10 },
  dateButton: { padding: 10, backgroundColor: "#fff", borderRadius: 10, marginHorizontal: 5, color: "#fff",  borderWidth: 1, // Add borderWidth to apply the border
    borderColor: "#ccc", },
  selectedDateButton: { backgroundColor: "#53B175" },
  dateText: { color: "#000" },
  selectedDateText: { color: "#fff" },
  rideList: { paddingHorizontal: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  duration: {
    fontSize: 12,
    color: "#888",
  },
  endTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginLeft:20
  },
  locationText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },
  routeLine: {
    flex: 1,
    alignItems: "center",
  },
  dottedLine: {
    width: 1,
    height: 40,
    backgroundColor: "#ccc",
    borderStyle: "dotted",
  },
  
  modeOfTravel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modeOfTravelLabel: {
    fontSize: 18,
    color: "black",
    fontWeight:'bold'
  },
  modeOfTravelValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
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
  marginLeft: 95,
  marginTop:-20
},
verticalseparator: {
  width: 1, // Set width to 1 for a thin line
  backgroundColor: '#ddd', // Make the background transparent
  borderStyle: 'dashed', // Dotted border style
  borderLeftWidth: 1, // Add left border to simulate a vertical line
  borderLeftColor: '#ddd', // Set the color for the dotted line
  height: '40', // Set height to 100% or any specific height you need
  marginHorizontal: 35, // Optional: add horizontal spacing if needed

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

});

export default SearchRide;

