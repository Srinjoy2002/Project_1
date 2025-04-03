import axios from 'axios';

const BASE_URL = "https://swiftmed.in/address"; // Replace with your backend URL if deployed

export const saveAddress = async (addressData) => {
  try {
    const response = await axios.post(`${BASE_URL}/address`, addressData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data)
    return response.data; // Return the response data directly
  } catch (error) {
    // Handle and throw a detailed error message
    const errorMessage =
      error.response?.data?.error || "Failed to save address";
    throw new Error(errorMessage);
  }
};
