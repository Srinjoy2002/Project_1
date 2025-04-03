import axios from 'axios';

// Base URL for your API backend
const API_URL = 'http://192.168.1.4:5002/api'; // Replace with your backend URL if necessary

/**
 * Function to update user profile.
 * @param {string} firstName - User's first name.
 * @param {string} lastName - User's last name.
 * @param {string} email - User's email address.
 * @param {string} phoneNumber - User's phone number.
 * @returns {Promise<Object>} - The response from the server.
 */
export const updateProfile = async (firstName, lastName, email, phoneNumber) => {
  const profileData = {
    firstName,
    lastName,
    email,
    phoneNumber,
  };

  try {
    const response = await axios.post(`${API_URL}/create`, profileData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Profile updated successfully:', response.data);
    return response;  // Return response to be used in the calling function
  } catch (error) {
    console.error('Error updating profile:', error.response ? error.response.data : error.message);
    throw error;  // Rethrow error to be caught in the calling function
  }
};


/**
 * Function to fetch the user profile.
 * @returns {Promise<Object>} - The user's profile data.
 */
// Function to fetch the user profile.
export const getProfile = async (id) => {
  try {
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');

    // Ensure the token exists
    if (!token) {
      throw new Error('Token not found');
    }

    // Make the API call to fetch the user profile with the token
    const response = await axios.get(`${API_URL}/getall`, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the token here
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    throw error;
  }
};