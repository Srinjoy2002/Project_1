import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReviewDetails = ({ onClose, onSearch, earning, id }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Function to handle the booking request
  const handleSendRequest = async () => {
    try {
      setLoading(true);

      // Fetch phone number from AsyncStorage
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (!phoneNumber) {
        Alert.alert("Error", "Phone number not found in storage");
        setLoading(false);
        return;
      }

      // API call
      const response = await fetch("http://192.168.1.4:5002/t/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          rideId: id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Booking request sent successfully!");
        navigation.navigate('RequestSentScreen'); // Navigate on success
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.infoRow}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Review Details</Text>
      </View>

      {/* Route Details */}
      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          {/* Start Point */}
          <View style={styles.locationRow}>
            <Image source={require("../Images/locon.png")} style={styles.locationIcon} />
            <Text style={styles.locationText}>Kolkata</Text>
          </View>

          <View style={styles.verticalseparator} />
          <View style={styles.separator} />

          {/* End Point */}
          <View style={styles.locationRow}>
            <Image source={require("../Images/locend.png")} style={styles.locationIcon} />
            <Text style={styles.locationText}>Durgapur</Text>
          </View>
        </View>
      </View>

      {/* Fare Details */}
      <View style={styles.fareDetails}>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.value}>₹500</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>T&E Fee</Text>
          <Text style={styles.value}>₹200</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.discount]}>Discount</Text>
          <Text style={[styles.value, styles.discount]}>-₹500</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Expected Fare</Text>
          <Text style={styles.totalValue}>₹{earning}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleSendRequest}
          disabled={loading} // Disable while loading
        >
          <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Request"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 5,
  },
  routeContainer: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#00a000",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  routePoint: {
    marginBottom: 8,
  },
  fareDetails: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  discount: {
    color: "green",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#53B175",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#D83F3F",
  },
  cancelButtonText: {
    color: "#D83F3F",
    fontWeight: "bold",
    fontSize: 16,
  },
  requestButton: {
    flex: 1,
    backgroundColor: "#D83F3F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  separator: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    marginLeft: 40,
    marginTop: -20,
  },
  verticalseparator: {
    width: 1,
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    height: 40,
    marginHorizontal: 11,
  },
});

export default ReviewDetails;
