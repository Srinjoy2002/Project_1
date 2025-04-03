import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure to import AsyncStorage
import Header from '../../header';

const AddAddress = ({ navigation }) => {
  const [selectedSaveAs, setSelectedSaveAs] = useState('Home');
  const [address, setAddress] = useState({
    location: '',
    pincode: '',
    flat: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    saveAs: 'Home',
  });

  const addressFields = [
    { label: 'Your Location', placeholder: 'Lorem Ipsum', value: 'location' },
    { label: 'Pincode', placeholder: '110008', value: 'pincode' },
    { label: 'Flat, House no, Building, Company Apartment', placeholder: '33/19, 1st Floor, West Patel Nagar', value: 'flat' },
    { label: 'Area, Street, Sector Village', placeholder: 'West Patel Nagar', value: 'street' },
    { label: 'Landmark', placeholder: 'Near Ramjas Ground', value: 'landmark' },
    { label: 'Town/City', placeholder: 'New Delhi', value: 'city' },
    { label: 'State', placeholder: 'Delhi', value: 'state' },
  ];

  const handleInputChange = (name, value) => {
    setAddress({ ...address, [name]: value });
  };

  const handleSaveAsSelect = (value) => {
    setSelectedSaveAs(value);
    setAddress({ ...address, saveAs: value });
  };

  const handleSaveAddress = async () => {
    // Validation
    if (!address.location || !address.pincode || !address.flat || !address.street || !address.city || !address.state) {
      Alert.alert('Error', 'Please fill all the fields before saving.');
      return;
    }

    try {
      const baseurl = await AsyncStorage.getItem('apiBaseUrl');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      
      if (!baseurl || !phoneNumber) {
        Alert.alert('Error', 'Unable to fetch user information.');
        return;
      }

      const response = await fetch(`${baseurl}address/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...address,
          phoneNumber, // Send the phone number with the request
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Address saved successfully!');
        navigation.goBack();
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to save address');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save address');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
          <Header title="Add New Address" navigation={navigation} />


            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <MaterialIcons name="location-pin" size={40} color="black" style={styles.mapPin} />
                <Text style={styles.mapText}>
                  Professional will arrive here{'\n'}Move the pin to adjust
                </Text>
              </View>
            </View>

            <FlatList
              data={addressFields}
              renderItem={({ item }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={item.placeholder}
                    value={address[item.value]}
                    onChangeText={(text) => handleInputChange(item.value, text)}
                  />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.formContainer}
            />

            <Text style={[styles.label, { marginTop: 20, marginLeft: 20 }]}>Save As</Text>
            <View style={styles.saveAsContainer}>
              {['Home', 'Others', 'Work'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.saveAsButton,
                    selectedSaveAs === option && styles.saveAsSelected,
                  ]}
                  onPress={() => handleSaveAsSelect(option)}
                >
                  <Text
                    style={
                      selectedSaveAs === option
                        ? styles.saveAsTextSelected
                        : styles.saveAsText
                    }
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff',marginTop:20 },
  header: { backgroundColor: '#D32F2F', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 34 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  mapContainer: { height: 200, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  mapPlaceholder: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  mapPin: { position: 'absolute', top: '40%' },
  mapText: { color: '#fff', fontSize: 14, textAlign: 'center', padding: 5, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.6)' },
  formContainer: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
  saveAsContainer: { flexDirection: 'row', marginHorizontal: 20 },
  saveAsButton: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginRight: 10 },
  saveAsSelected: { backgroundColor: '#d3f0e4', borderColor: '#66bb6a' },
  saveAsText: { color: '#000' },
  saveAsTextSelected: { color: '#66bb6a' },
  saveButton: { backgroundColor: '#D32F2F', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8, margin: 20 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
