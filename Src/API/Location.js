// import axios from 'axios';

// const BASE_URL = 'http://192.168.0.104:5002/api'; // Replace with your backend base URL

// export const fetchLocations = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/location`);
//     return response.data; // Axios automatically parses the response JSON
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.error || `Error fetching locations: ${error.message}`;
//     console.error(errorMessage);
//     throw new Error(errorMessage);
//   }
// };

import axios from 'axios';

const BASE_URL = 'http://192.168.1.4:5002/api'; // Replace with your backend base URL

/**
 * Fetch autocomplete suggestions for 'going' and 'leaving'.
 * @param {string} going - The 'going' query parameter.
 * @param {string} leaving - The 'leaving' query parameter.
 * @returns {Promise<Object>} - An object containing goingSuggestions and leavingSuggestions.
 */
export const fetchLocations = async (going, leaving) => {
  try {
    // Only send non-empty parameters
    const response = await axios.get(`${BASE_URL}/location`, {
      params: {
        going: going || undefined, // Send `undefined` if `going` is empty
        leaving: leaving || undefined, // Send `undefined` if `leaving` is empty
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error.response?.data || error.message);
    throw error;
  }
};




