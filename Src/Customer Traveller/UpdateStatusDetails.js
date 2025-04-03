import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RNPickerSelect from 'react-native-picker-select';

const ReviewDetails = ({ id }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Collected');
  const [travelNumber, setTravelNumber] = useState('');

  useEffect(() => {
    fetch("http://192.168.1.4:5002/map/ride-status")
      .then((res) => res.json())
      .then((data) => {
        console.log("Ride Status:", data);
      })
      .catch((error) => console.error("Error fetching ride status:", error));
  }, []);


  const handleValueChange = (value) => {
    console.log(value)
    if (value!='null') {
      setSelectedMode(value);
    } else {
      alert("Please select a valid option.");
    }
  };

  const handleSubmit = async () => {
    // **Validation Check**
    if (!selectedMode) {
      Alert.alert("Validation Error", "Please select one Option.");
      return;
    }
    if (!travelNumber.trim()) {
      Alert.alert("Validation Error", "Please enter OTP.");
      return;
    }

    try {
      setLoading(true);
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (!phoneNumber) {
        Alert.alert("Error", "Phone number not found in storage");
        setLoading(false);
        return;
      }

      // **POST API Call**
      const response = await fetch("http://192.168.31.66:5002/t/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          rideId: id,
          otp: travelNumber,
          modeOfTravel: selectedMode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Booking request sent successfully!");
        navigation.navigate('RequestSentScreen');
      } else {
        Alert.alert("Error", data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending booking request:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailsContainer}>
        {/* **Mode of Travel Dropdown** */}
        <Text style={styles.label}>Mode of Travel</Text>
        <View style={styles.input}>
          <RNPickerSelect
            // onValueChange={(value) => setSelectedMode(value)}
       onValueChange={handleValueChange}

            items={[
              { label: 'Collected', value: 'Collected' },
              { label: 'Completed', value: 'Completed' },
            ]}
            placeholder={{ label: "Select a mode", value: null }}
          >
            <Text>{selectedMode ? selectedMode : "Please select a mode"}</Text>
          </RNPickerSelect>
        </View>

        {/* **OTP Input** */}
        <Text style={styles.label}>OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#999"
          value={travelNumber}
          onChangeText={setTravelNumber}
          keyboardType="numeric"
        />

        {/* **Submit Button** */}
        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.nextButtonText}>{loading ? "Submitting..." : "Submit"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  detailsContainer: {
    flex: 3,
    padding: 5,
    backgroundColor: '#fff',
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
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#D83F3F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ReviewDetails;
