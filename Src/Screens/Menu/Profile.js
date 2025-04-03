import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles from '../../styles';


import verificationImage from '../../Images/kyc.png'; // Replace with your image path
const DEFAULT_PROFILE_PHOTO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const API_URL = 'http://192.168.1.4:5002/api'; // Replace with your backend URL
const { width } = Dimensions.get('window'); // Get device width

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();

    const [profilePhotoUri, setProfilePhotoUri] = useState(DEFAULT_PROFILE_PHOTO);
   const selectImage = useCallback(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to your photos.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
      });
  
      if (!result.canceled) {
        setProfilePhotoUri(result.assets[0].uri);
      } else {
        Alert.alert('Action Cancelled', 'No image was selected.');
      }
    }, []);

  const [profileData, setProfileData] = useState({
    profileImage: 'https://via.placeholder.com/100',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    accountNumber: '',
    accountName: '',
    ifscCode: '',
    bankName: '',
    branch: '',
  });

  // Load Profile Data from AsyncStorage
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const firstName = (await AsyncStorage.getItem('firstName')) || '';
        const lastName = (await AsyncStorage.getItem('lastName')) || '';
        const email = (await AsyncStorage.getItem('email')) || '';
        const phoneNumber = (await AsyncStorage.getItem('phoneNumber')) || '';

        setProfileData((prevState) => ({
          ...prevState,
          firstName,
          lastName,
          email,
          phoneNumber,
        }));
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  // Handle Image Picker
  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.assets) {
        setProfileData((prevState) => ({
          ...prevState,
          profileImage: response.assets[0].uri,
        }));
      }
    });
  };

  const handleStartVerification = () => {
    // Navigate to the DLT screen
    navigation.navigate('DLTScreen');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Profile Picture */}

  <View style={styles.innerContainer}>
  <View style={styles.profilePhotoContainer}>
            <Image source={{ uri:profilePhotoUri}} style={styles.profilePhoto} />
            <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
              <Image source={require('../../Images/Vector.png')} />
            </TouchableOpacity>
            <Text style={styles.profilePhotoText}>Profile Photo</Text>
          </View>
          </View>

    
      {/* Personal Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <TextInputField label="Email" value={profileData.email} editable={false} />
        <TextInputField label="Phone Number" value={profileData.phoneNumber} editable={false} />
        <TextInputField
          label="First Name"
          value={profileData.firstName}
          onChangeText={(text) =>
            setProfileData((prevState) => ({ ...prevState, firstName: text }))
          }
        />
        <TextInputField
          label="Last Name"
          value={profileData.lastName}
          onChangeText={(text) =>
            setProfileData((prevState) => ({ ...prevState, lastName: text }))
          }
        />
      </View>

      {/* Verification Section */}
      <View style={styles.verificationSection}>
        <Text style={styles.verificationTitle}>Profile Verification (KYC)</Text>
        <Image source={verificationImage} style={styles.verificationImage} />
        <View style={styles.verificationContainer}>
          {['Upload Driving License', 'Upload Aadhaar Card/Voter ID/Passport', 'Take a Selfie Photo'].map(
            (step, index) => (
              <Text key={index} style={styles.verificationStep}>
                {`${index + 1}. ${step}`}
              </Text>
            )
          )}
        </View>

        {/* Start Verification Button */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleStartVerification}>
            <Text style={styles.saveButtonText}>Start Verification</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bank Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Account Details</Text>
        {[{ label: 'Account Number', value: profileData.accountNumber, field: 'accountNumber' },
          { label: 'Account Name', value: profileData.accountName, field: 'accountName' },
          { label: 'IFSC Code', value: profileData.ifscCode, field: 'ifscCode' },
          { label: 'Bank Name', value: profileData.bankName, field: 'bankName' },
          { label: 'Branch', value: profileData.branch, field: 'branch' }].map(({ label, value, field }) => (
          <TextInputField
            key={field}
            label={label}
            value={value || ''}
            onChangeText={(text) =>
              setProfileData((prevState) => ({ ...prevState, [field]: text }))
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

const TextInputField = ({ label, value, onChangeText, editable = true }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholder={`Enter ${label}`}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#D32F2F', flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  profilePictureContainer: { alignItems: 'center', marginVertical: 20 },
  profileImage: { width: width * 0.25, height: width * 0.25, borderRadius: width * 0.125 },
  editIcon: { position: 'absolute', top: '75%', left: '60%', backgroundColor: '#D32F2F', borderRadius: 50, padding: 5 },
  section: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 14, color: '#555', marginBottom: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, backgroundColor: '#f9f9f9' },
  verificationSection: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', marginBottom: 15 },
  verificationTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  verificationImage: { width: '100%', height: 200, resizeMode: 'contain' },
  verificationContainer: { paddingLeft: 10, marginBottom: 10 },
  verificationStep: { fontSize: 14, marginBottom: 5 },
  saveButtonContainer: { alignItems: 'center', paddingVertical: 20 },
  saveButton: { backgroundColor: '#D32F2F', paddingVertical: 12, paddingHorizontal: 100, borderRadius: 5 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  innerContainer: { padding: 20 },
  profilePhotoContainer: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  profilePhoto: { width: 120, height: 120, borderRadius: 60 },
  editIcon: {
    position: 'absolute',
    bottom: 50,
    left: '60%',
    backgroundColor: '#006EFF',
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profilePhotoText: { marginTop: 10, fontSize: 16, color: commonStyles.Colors.blackColor, fontWeight: '500' }

});

export default Profile;
