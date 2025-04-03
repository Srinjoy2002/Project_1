import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import RNSimData from 'react-native-sim-data'; // Import the SIM data package
import Ionicons from 'react-native-vector-icons/Ionicons';
import commonStyles from '../../styles';

const logoImage = require('../../Images/logow.png');

const WelcomeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isModalVisible, setModalVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPhoneNumber();
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const simData = RNSimData.getSimInfo(); // Fetch SIM data
      console.log('SIM Data:', simData);

      // Extract phone number if available
      const number =
        simData?.sim1?.phoneNumber || simData?.sim2?.phoneNumber || '';
      if (number) {
        setPhoneNumber(number.replace('+91', '')); // Remove country code if needed
      }
    } catch (error) {
      console.error('Error fetching phone number:', error);
    }
  };

  const validateInput = () => {
    if (/^\d{10}$/.test(phoneNumber)) {
      return true;
    }
    setErrorMessage('Please enter a valid 10-digit phone number.');
    return false;
  };

 
  const handleNextPress = async () => {
    if (!validateInput()) return;
  
    setErrorMessage('');
    setLoading(true);
  
    try {
      const formattedPhoneNumber = `+91${phoneNumber}`;
  
      // Call the API
      const response = await fetch('http://192.168.1.4:5002/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formattedPhoneNumber }),
      });
  
      const responseData = await response.json();
      console.log('API Response:', responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong.');
      }


      alert(formattedPhoneNumber)
  
      // Save phone number to AsyncStorage
      await AsyncStorage.setItem('phoneNumber', formattedPhoneNumber);
      await AsyncStorage.setItem('isNewUser', String(responseData.is_newuser || ''));

      if(responseData.is_new_user == false){
        await AsyncStorage.setItem('firstName', String(responseData.firstName || ''));
        await AsyncStorage.setItem('lastName', String(responseData.lastName || ''));
      }
  
      // Navigate to OTP screen with phone number and OTP
      navigation.navigate('Otp', { phoneNumber: formattedPhoneNumber, otpsend: responseData.otp });
  
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  




  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Terms and Conditions Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.bottomSheet}>
            <Text style={styles.title}>Terms & Conditions</Text>
            <ScrollView style={styles.content}>
              <Text style={styles.text}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </Text>
            </ScrollView>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => setIsChecked(!isChecked)}
                color="#666"
              />
              <Text style={styles.checkboxText}>I accept the terms and conditions</Text>
            </View>
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              disabled={!isChecked}
              style={[
                styles.submitButton,
                { backgroundColor: isChecked ? commonStyles.Colors.primary : '#ccc' },
              ]}
            >
              Submit
            </Button>
          </View>
        </View>
      </Modal>

      {/* Welcome Screen Content */}
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logoImage} />
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>

      <Text style={styles.label}>Enter Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          setErrorMessage('');
        }}
        keyboardType="phone-pad"
        returnKeyType="done"
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: phoneNumber ? '#D83F3F' : '#ccc' }]}
        disabled={!phoneNumber || loading}
        onPress={handleNextPress}
      >
        <Text style={styles.nextButtonText}>{loading ? 'Loading...' : 'Next'}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By tapping next you are creating an account and you agree to{' '}
        <Text style={styles.link}>Account Terms</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 42, height: 42, marginRight: 10 },
  welcomeText: { fontSize: 42, fontWeight: 'bold', color: '#D83F3F' },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 10, color: commonStyles.Colors.blackColor },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, fontSize: 16 },
  errorText: { color: 'red', fontSize: 14, marginBottom: 10 },
  nextButton: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  footerText: { fontSize: 14, color: commonStyles.Colors.textColor, marginTop: 20, textAlign: 'left' },
  link: { color: commonStyles.Colors.linkColor },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  content: { flex: 1 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkboxText: { fontSize: 14 },
  submitButton: { height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 8 },
  backButton: { position: 'absolute', top: 70, left: 20, zIndex: 1 },
});

export default WelcomeScreen;
