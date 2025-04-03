import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import commonStyles from '../../styles';

const logoImage = require('../../Images/logow.png');

const Otp = ({ navigation, route }) => {
  const { phoneNumber ,otpsend} = route.params;
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [resendTime, setResendTime] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTime > 0) {
      const timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTime]);

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Ensure only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when OTP is fully entered
    if (newOtp.every((digit) => digit !== '')) {
      handleConfirm(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResendOtp = () => {
    setResendTime(60);
    Toast.show({ type: 'info', text1: 'Info', text2: 'OTP has been resent!' });
  };

  const handleConfirm = async (finalOtp) => {
    try {
      console.log("Sending OTP verification request..."); // Debugging log
      const response = await fetch('http://192.168.1.4:5002/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: finalOtp }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData);
        alert(errorData.error || 'Invalid OTP');
        return;
      }
  
      const data = await response.json();
      console.log('API Response:', data); // Debugging the full response
  
      console.log("✅ Received userDetails:", data.userDetails); // Debugging log
  
      if (data && response.ok) {
        // Set userLog to '1' indicating the user is logged in
        await AsyncStorage.setItem('userLog', '1');
  
        // Check if user is new or not
        if (data.isNewUser) {
          // Save userDetails if available
          if (data.userDetails && Object.keys(data.userDetails).length > 0) {
            await AsyncStorage.setItem('userDetails', JSON.stringify(data.userDetails));
          } else {
            // If no userDetails, save an empty object
            await AsyncStorage.setItem('userDetails', JSON.stringify({}));
          }
          // Navigate to Profile screen
          navigation.navigate('Profile', { user: data.userDetails || {} });
        } else {
          // For existing user, handle the userDetails properly
          if (data.userDetails && Object.keys(data.userDetails).length > 0) {
            await AsyncStorage.setItem('userDetails', JSON.stringify(data.userDetails));
          } else {
            // If no userDetails, remove it from AsyncStorage
            await AsyncStorage.removeItem('userDetails');
          }
          // Navigate to Navigation screen (or the main dashboard)
          navigation.navigate('Navigation');
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to verify OTP. Please try again.',
      });
    }
  };
  

  

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logoImage} />
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>

      <Text style={styles.infoText}>
        Enter the code sent to <Text style={styles.phoneNumber}> (+91 {phoneNumber.replace('91','')})</Text>
      </Text>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
            returnKeyType='done'
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleResendOtp} disabled={resendTime > 0}>
        <Text style={[styles.resendText, { color: resendTime > 0 ? '#777' : commonStyles.Colors.linkColor,fontWeight:'bold' }]}>
          {resendTime > 0 ? `Resend OTP in ${resendTime}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.confirmButton, otp.some((digit) => digit === '') && styles.disabledButton]}
        onPress={() => handleConfirm(otp.join(''))}
        disabled={otp.some((digit) => digit === '')}
      >
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, justifyContent: 'center', backgroundColor: '#fff' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 42, height: 42, marginRight: 10 },
  welcomeText: { fontSize: 42, fontWeight: 'bold', color: '#D83F3F' },
  infoText: { fontSize: 16, color: commonStyles.Colors.blackColor, textAlign: 'center', marginBottom: 30 , fontWeight:'bold' },
  phoneNumber: { fontWeight: '700', color: '#333' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8,
    elevation: 2,
  },
  resendText: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  confirmButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    elevation: 2,
  },
  confirmText: { fontSize: 18, fontWeight: '500', color: '#FFF' },
  disabledButton: { backgroundColor: '#DDD' },
  backButton: { position: 'absolute', top: 70, left: 20, zIndex: 1 },
});

export default Otp;
