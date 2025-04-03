import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useCallback } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { updateProfile } from '../../API/Profile';  // Ensure this function handles FormData
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DEFAULT_PROFILE_PHOTO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const Verification = ({ route }) => {
  const navigation = useNavigation();
  const { phoneNumber } = route.params;

  const [profilePhotoUri, setProfilePhotoUri] = useState(DEFAULT_PROFILE_PHOTO);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Function to select an image
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

  // Function to save profile with FormData
  
  const saveProfile = useCallback(async () => {
    if (!firstName || !lastName ||profilePhotoUri == DEFAULT_PROFILE_PHOTO ) {
      Alert.alert('Validation Error', 'Full Names and Profile Picture are required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
  
    if (profilePhotoUri && profilePhotoUri !== DEFAULT_PROFILE_PHOTO) {
      const fileName = profilePhotoUri.split('/').pop();
      const fileType = fileName.split('.').pop();
  
      formData.append('profilePicture', {
        uri: profilePhotoUri,
        name: fileName,
        type: `image/${fileType}`,
      });
    }
  
    try {
      const response = await fetch('http://192.168.31.66:5002/api/create', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const responseData = await response.json();
      console.log('API Response:', responseData);
  
      if (!response.ok) {
        // API returned an error (400, 404, etc.)
        Alert.alert('Error', responseData.message || 'Something went wrong.');
        return;
      }
  
      Alert.alert('Success', 'Profile updated successfully.');
      AsyncStorage.setItem('userLog','1');
      AsyncStorage.setItem('firstName',firstName.toString());
      AsyncStorage.setItem('lastName',lastName.toString());

      navigation.navigate('Region', { userId: responseData.user?._id });
  
    } catch (error) {
      console.error('Save Profile Error:', error);
      Alert.alert('Error', 'Failed to save the profile. Please try again.');
    }
  }, [firstName, lastName, email, phoneNumber, profilePhotoUri, navigation]);
  




  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          {/* Profile Photo Section */}
          <View style={styles.profilePhotoContainer}>
            <Image source={{ uri: profilePhotoUri }} style={styles.profilePhoto} />
            <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
              <Image source={require('../../Images/Vector.png')} />
            </TouchableOpacity>
            <Text style={styles.profilePhotoText}>Profile Photo</Text>
          </View>

          {/* Phone Number Section */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.verifiedContainer}>
  <Icon name="verified" size={24} color="#1B5E20" />
  <Text style={styles.verifiedText}>VERIFIED</Text>
</View>
            </View>
            <TextInput style={[styles.input, styles.disabledInput]} value={phoneNumber} editable={false} />
          </View>

          {/* First Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Email Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  profilePhotoText: { marginTop: 10, fontSize: 16, color: commonStyles.Colors.blackColor, fontWeight: '500' },
  label: { fontSize: 16, color: commonStyles.Colors.secondColor, marginBottom: 10, fontWeight: 'bold' },
  inputContainer: { marginBottom: 15 },
  labelContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verifiedText: {
    color: commonStyles.Colors.successTextColor, // Dark green text
    fontWeight: 'bold',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#888' },
  saveButton: {
    backgroundColor: commonStyles.Colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonStyles.Colors.successBackgroundColor, // Light green background
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom:5
  },

});

export default Verification;
