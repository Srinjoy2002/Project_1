import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from "react-native";
import { RadioButton,Provider as PaperProvider } from "react-native-paper";
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';



const radioOptions = [
  { label: "Reason 1", value: "reason1" },
  { label: "Reason 2", value: "reason2" },
  { label: "Reason 3", value: "reason3" },
  { label: "Reason 4", value: "reason4" },
];


const Cancellation = () => {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalReason, setAdditionalReason] = useState("");

    const navigation = useNavigation();
  


  const handleCancelRide = async () => {
    // Validation check
    if (!selectedReason) {
      Alert.alert("Validation Error", "Please select a reason for cancellation.");
      return;
    }

    if (!additionalReason.trim()) {
      Alert.alert("Validation Error", "Please elaborate on your reason for cancellation.");
      return;
    }

    // Prepare data for the POST request
    const postData = {
      reason: selectedReason,
      additionalReason: additionalReason.trim(),
    };

    try {
      // POST API call (You can replace the URL with your actual API endpoint)
      const response = await fetch("https://your-api-endpoint.com/cancel-ride", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", "Ride cancelled successfully!");
        // Navigate back or show a success message
        navigation.goBack();
      } else {
        Alert.alert("Error", "Something went wrong, please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to cancel the ride. Please check your internet connection.");
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
                       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                         <Ionicons name="chevron-back" size={24} color="white" />
                       </TouchableOpacity>
                       <Text style={styles.headerTitle}>Reason for Cancellation</Text>
                     </View>



      {/* Description */}
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet consectetur. Gravida in tincidunt rhoncus
        amet purus.
      </Text>

      {/* Select reason section */}
      <Text style={styles.sectionTitle}>Select a reason for cancellation</Text>
    

      <View style={styles.container1}>
        <RadioButton.Group
          onValueChange={(value) => setSelectedReason(value)}
          value={selectedReason}
        >
          {radioOptions.map((item) => (
            <View key={item.value} style={styles.radioButtonContainer}>
              <RadioButton.Android value={item.value} status={selectedReason === item.value ? "checked" : "unchecked"}
                color={selectedReason === item.value ? "#2474e1" : "gray"} /> 
              <Text style={styles.radioText}>{item.label}</Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>


      {/* Text input for additional reason */}
      <TextInput
        style={styles.textInput}
        placeholder="Elaborate your reason for cancellation*"
        value={additionalReason}
        onChangeText={setAdditionalReason}
        // multiline
        // keyboardType="phone-pad"
          returnKeyType="done"
        
      />

      {/* Cancel button */}
      <TouchableOpacity
                    style={styles.button}
                    onPress={handleCancelRide}// Trigger bottom sheet on press
                  >
                    <Text style={styles.buttonText}>Cancel Ride</Text>
                  </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Cancellation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  container1: {

    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  description: {
    color: "#8C8C8C",
    fontSize: 14,
    // textAlign: "center",
    marginBottom: 20,
    backgroundColor:'#F4F4F4',
    padding:20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    margin:10
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioText: {
    fontSize: 14,
    marginLeft: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    margin:10,
    height:150
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
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
  button: {
    backgroundColor: 'transparent',  // Transparent background
    borderWidth: 2,                  // Border outline
    borderColor: '#D83F3F',          // Border color
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    margin:10
  },
  buttonText: {
    color: '#D83F3F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioButtonContainer: {
    flexDirection: "row", // Ensure text aligns with radio button
    alignItems: "center", // Keep text vertically centered
    marginBottom: 10,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 8, // Space between radio button & text
  },
});
