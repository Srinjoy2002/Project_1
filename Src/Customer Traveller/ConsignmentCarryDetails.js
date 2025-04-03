import React, { useEffect, useRef, useState } from "react";

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet"; // Importing the Bottom Sheet library
import Icon from 'react-native-vector-icons/FontAwesome';
import UpdateStatusDetails from '../Customer Traveller/UpdateStatusDetails';
import Header from "../header";
import commonStyles from "../styles";

const ConsignmentDetails = (ride) => {
  const navigation = useNavigation();
  const item = ride.route.params.ride;
  const bottomSheetRef = useRef();

  const [loading, setLoading] = useState(true); // Loading state

  const [earning, setEarning] = useState([]);
    const [rideStatus, setRideStatus] = useState([]);
      const [status, setStatus] = useState('e');
      const [isModalVisible, setModalVisible] = useState(false);
    
  
  

  console.log('ridedetails',item)


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // "1 Feb 2025"
  };



     useEffect(() => {
        fetch("http://192.168.1.4:5002/map/consignment-collected-status")
          .then((res) => res.json())
          .then((data) => {
            setRideStatus(data.status); // Corrected this
          })
          .catch((error) => console.error("Error fetching data:", error));
      }, []);



  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true); // Set loading before API call
  
        const baseurl = await AsyncStorage.getItem('apiBaseUrl');
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');
  
        if (!baseurl || !phoneNumber) {
          setError('Base URL or phone number not found.');
          setLoading(false);
          return;
        }
  
        const response = await fetch(`${baseurl}api/getearning`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consignmentId: item.consignmentId, // Ensure item is accessible
            phoneNumber: phoneNumber,
          }),
        });
  
        const data = await response.json();
  
        if (data && data.booking.expectedEarning) {
          console.log('expectedearning', data.booking.expectedEarning);
  
          setEarning(data.booking); // ✅ Update state
        } else {
          setEarning([]); // No data found
        }
      } catch (err) {
        setError('Error fetching addresses.');
      } finally {
        setLoading(false); // Stop loading once the API call is complete
      }
    };
  
    // Listen for screen focus and fetch addresses whenever the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddresses();
    });
  
    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, item.consignmentId]); // ✅ Ensure item.consignmentId is a dependency
  
  // ✅ Log earning after it updates
  useEffect(() => {
    console.log('Updated earning:', earning);
  }, [earning]);
  




  const handleRequest = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');

      if (!phoneNumber) {
        console.error('Phone number not found');
        return;
      }

      const response = await fetch('http://192.168.31.66:5002/api/request-for-consignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consignmentId: item.consignmentId,
          phoneNumber: phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Request sent successfully!");
        
        // Success response: Navigate to RequestSentScreen
        navigation.navigate('RequestSentScreen');
      } else {
        console.error('Error:', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };


  const handleSearch = () => {
    console.log("Search button pressed");
    setModalVisible(false); // Close modal on search
    navigation.navigate("TravelDetails");
  };


  return (


    
    <ScrollView style={styles.container}>


<Modal
  visible={isModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>

<View style={styles.modalContainer}>
    <UpdateStatusDetails
      onClose={() => setModalVisible(false)}
      onSearch={handleSearch}
    />
  </View>
  
</Modal>

      {/* Header */}
      <Header title="Consignments Details" navigation={navigation} />





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
      {index !== rideStatus.length - 1 && <View style={[commonStyles.verticalseparator, { marginTop: 5,marginLeft:10 }]} />}
    </View>
  ))}
</View>

      )}


      {/* Card 1 - Pickup & Dropoff */}
      <View style={styles.card}>
       
       
      
             
              <View style={styles.locationRow}>
                          <Image source={require("../Images/locon.png")} style={styles.locationIcon} />
                
                          <Text style={styles.locationText}>
  {item.username}: {item.phoneNumber}
  {'\n'}
  <Text style={styles.callNowText}>{item.startinglocation}</Text>
</Text>
            
              </View>
              
              <View style={commonStyles.verticalseparator}>
      
              </View>
              <View style={commonStyles.separator} />
            
              <View style={styles.locationRow}>
                 <Image source={require("../Images/locend.png")} style={styles.locationIcon} />
               

                 <Text style={styles.locationText}>
  {item.recievername}: {item.recieverphone}
  {'\n'}
  <Text style={styles.callNowText}>{item.goinglocation}</Text>
</Text>

              </View>
      
              <View style={[commonStyles.staraightSeparator, {marginTop:30}]} />
      
      
              {/* Travel Time and Distance */}
              <View style={styles.infoRow}>
              <Image source={require("../Images/clock.png")} style={[styles.locationIcon, { marginLeft: 5 }]} />
                <Text style={styles.infoText}>{item.distance}</Text>
              </View>
      
      







        {/* Distance */}
        
      </View>

      {/* Card 2 - Parcel Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}> Description of parcel</Text>
        <Text style={styles.parcelDescription}>
          {item.Description}
        </Text>
        <View style={styles.dottedLine} />
        {/* Weight & Dimensions */}
      
      
            <View style={styles.otherInfo}>
                      
                      
                      
            <View style={styles.infoBlock}>
                      <View style={[styles.infoRow, {marginTop:0}]}>
            
                    <Image source={require("../Images/weight.png")} style={[styles.locationIcon, { marginLeft:0 ,width:24,height:24,marginTop:-3}]} />
                        <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Weight</Text>
                        </View>
                        <Text style={[styles.infoSubtitle,{marginRight:20,marginLeft:-50,marginTop:5,fontSize:15,color:'black'}]}>{item.weight} Kg</Text>
                      </View>
      
                      
                      
                      
                    <View style={styles.infoBlock}>
                      <View style={[styles.infoRow, {marginTop:0}]}>
            
                    <Image source={require("../Images/dimension.png")} style={[styles.locationIcon, { marginLeft:0 ,width:24,height:24,marginTop:-3}]} />
                        <Text style={[styles.infoTitle,{marginRight:20,marginLeft:5,marginTop:0}]}>Dimensions</Text>
                        </View>
                        <Text style={[styles.infoSubtitle,{marginRight:20,marginLeft:-50,marginTop:5,fontSize:15,color:'black'}]}>{item.dimensions.length}X{item.dimensions.breadth}X{item.dimensions.height}</Text>
                      </View>
                     
                    </View>
       
       
       
       
        <View style={styles.dottedLine} />
        {/* Extra Information */}
        <View style={styles.extraInfo}>
          <Text style={styles.boldText} numberOfLines={1} >Handle with Care</Text>     
        </View>
        <View style={styles.extraInfo}> 
        <Text style={styles.extraValue} numberOfLines={1}>
  {item.handleWithCare ? item.handleWithCare : "No"}
</Text>
        </View>
        <View style={styles.dottedLine} />
        <View style={styles.extraInfo}>
          <Text style={styles.boldText} numberOfLines={1}>Special Requests</Text>
        </View>
        <View style={styles.extraInfo}> 
          <Text style={styles.extraValue} numberOfLines={1} >{item.specialRequest}</Text>
        </View>
        <View style={styles.dottedLine} />
        <View style={styles.extraInfo}>
          <Text style={styles.boldText} numberOfLines={1}>Date & Time of Delivery (Expected)</Text>
        </View>
        <View style={styles.extraInfo}> 
          <Text style={styles.extraValue} numberOfLines={1} >{formatDate(item.dateOfSending)} {new Date(item.dateOfSending).toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true // Set to false for 24-hour format
})}</Text>
        </View>
         
      </View>

      {/* Card 3 - Earning */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.boldText}>Total expected Earning</Text>

          <Text style={styles.earningText}> ₹{earning?.expectedEarning ?? 'Fetching...'}</Text>
        </View>
      </View>

      {/* Footer Button */}


      {status != 'Completed' && (
      <TouchableOpacity style={styles.footerButton} onPress={() => bottomSheetRef.current.open()}>
      <Text style={styles.buttonText}>
        
        Update Status</Text>
    </TouchableOpacity>
      )}



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
        <UpdateStatusDetails earning = {ride.expectedearning} id={ride.rideId}  /> {/* ReviewDetails component will be displayed inside the Bottom Sheet */}
      </RBSheet>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
  },
  header: {
    backgroundColor: '#D32F2F',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 10,
  },
  locationTextContainer: {
    marginLeft: 12,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
   
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
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 0.5,
    borderColor: '#aaa',
    marginVertical: 12,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
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
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  callNowText:{
    color: 'black',
    fontSize: 16,
    // marginLeft:20,
    // marginTop:5,
    position:'absolute',
    left:50,
    top:25,
    fontWeight:'light'


  },
  
});

export default ConsignmentDetails;
