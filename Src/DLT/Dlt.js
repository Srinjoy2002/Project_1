// import axios from 'axios';
// import React, { useState } from 'react';
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// const Dlt = () => {
//   const [dlNumber, setDlNumber] = useState('');
//   const [aadhaarNumber, setAadhaarNumber] = useState('');
//   const [panNumber, setPanNumber] = useState('');

//   // Function to verify Driving License
//   const verifyDrivingLicense = async () => {
//     if (!dlNumber) {
//       Alert.alert('Error', 'Please enter your Driving License number.');
//       return;
//     }
//     try {
//       const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
//       const response = await axios.post(
//         'https://eve.idfy.com/v3/tasks/async/extract/ind_driving_license', // IDfy DL verification endpoint
//         {
//           type: 'dl',
//           document_data: {
//             number: dlNumber, // Use user input for DL number
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${API_KEY}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data.success) {
//         Alert.alert('Success', 'Driving License verified successfully!');
//         console.log(response.data);
//       } else {
//         Alert.alert('Error', 'Driving License verification failed!');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to verify Driving License.');
//     }
//   };

//   // Function to verify Aadhaar
//   const verifyAadhaar = async () => {
//     if (!aadhaarNumber) {
//       Alert.alert('Error', 'Please enter your Aadhaar number.');
//       return;
//     }
//     try {
//       const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
//       const response = await axios.post(
//         'https://eve.idfy.com/v3/tasks/async/extract/ind_aadhaar', // IDfy Aadhaar verification endpoint
//         {
//           type: 'aadhaar',
//           document_data: {
//             number: aadhaarNumber, // Use user input for Aadhaar number
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${API_KEY}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data.success) {
//         Alert.alert('Success', 'Aadhaar verified successfully!');
//         console.log(response.data);
//       } else {
//         Alert.alert('Error', 'Aadhaar verification failed!');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to verify Aadhaar.');
//     }
//   };

//   // Function to verify PAN Card
//   const verifyPAN = async () => {
//     if (!panNumber) {
//       Alert.alert('Error', 'Please enter your PAN number.');
//       return;
//     }
//     try {
//       const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
//       const response = await axios.post(
//         'https://eve.idfy.com/v3/tasks/async/extract/ind_pan', // IDfy PAN verification endpoint
//         {
//           type: 'pan',
//           document_data: {
//             number: panNumber, // Use user input for PAN number
//           },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${API_KEY}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data.success) {
//         Alert.alert('Success', 'PAN Card verified successfully!');
//         console.log(response.data);
//       } else {
//         Alert.alert('Error', 'PAN Card verification failed!');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to verify PAN Card.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Profile Verification (KYC)</Text>
//       <Text style={styles.subtitle}>VERIFY YOUR PROFILE IN 3 EASY STEPS</Text>

//       {/* Driving License Verification */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Driving License Number"
//         value={dlNumber}
//         onChangeText={(text) => setDlNumber(text)}
//       />
//       <TouchableOpacity style={styles.button} onPress={verifyDrivingLicense}>
//         <Text style={styles.buttonText}>Verify Driving License</Text>
//       </TouchableOpacity>

//       {/* Aadhaar Verification */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Aadhaar Number"
//         value={aadhaarNumber}
//         onChangeText={(text) => setAadhaarNumber(text)}
//         keyboardType="numeric"
//       />
//       <TouchableOpacity style={styles.button} onPress={verifyAadhaar}>
//         <Text style={styles.buttonText}>Verify Aadhaar</Text>
//       </TouchableOpacity>

//       {/* PAN Card Verification */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter PAN Number"
//         value={panNumber}
//         onChangeText={(text) => setPanNumber(text)}
//       />
//       <TouchableOpacity style={styles.button} onPress={verifyPAN}>
//         <Text style={styles.buttonText}>Verify PAN Card</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Dlt;
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Dlt = () => {
  const [dlNumber, setDlNumber] = useState('');
  const [dob, setDob] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [requestId, setRequestId] = useState('');

  // Function to verify Driving License and get request_id
  // const verifyDrivingLicense = async () => {
  //   if (!dlNumber || !dob) {
  //     Alert.alert('Error', 'Please enter both Driving License number and Date of Birth.');
  //     return;
  //   }

  //   try {
  //     const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
  //     const ACCOUNT_ID = 'd1591c99d748/6a937975-a93e-4e6e-a5dd-7aa8663f1db2'; // Replace with your actual Account ID
  //     const URL = 'https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_driving_license';
  //     var data={
  //           "task_id": "74f4c926-250c-43ca-9c53-453e87ceacd1",
  //               "group_id": "8e16424a-58fc-4ba4-ab20-5bc 
  //     }

  //     // const response = await axios.post(
        
        
  //     //      // Replace with your task ID
  //     //     // Replace with your group ID
  //     //     data, {
  //     //       group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
  //     //       task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
  //     //       id_number: dlNumber, // Use user input for DL number
  //     //       date_of_birth: dob, // Use user input for Date of Birth
  //     //     },
        
  //     //   {
  //     //     headers: { 
  //     //       'Content-Type': 'application/json', 
  //     //       'account-id': 'ACCOUNT_ID', 
  //     //       'api-key': 'API_KEY'
  //     //     },
  //     //   }
  //     // );

  //     if (response.data.request_id) {
  //       setRequestId(response.data.request_id); // Save the request_id
  //       Alert.alert('Success', 'Driving License request initiated. Now checking verification status...');
  //       console.log('Request ID:', response.data.request_id);
  //     } else {
  //       Alert.alert('Error', 'Failed to get request ID for verification.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert('Error', 'Failed to verify Driving License.');
  //   }
  // };
  const verifyDrivingLicense = async () => {
    if (!dlNumber || !dob) {
      Alert.alert('Error', 'Please enter both Driving License number and Date of Birth.');
      return;
    }
  
    try {
      const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
      const ACCOUNT_ID = 'd1591c99d748/6a937975-a93e-4e6e-a5dd-7aa8663f1db2'; // Replace with your actual Account ID
      const URL = 'https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_driving_license';
  
      var data = JSON.stringify({
        task_id: "74f4c926-250c-43ca-9c53-453e87ceacd1",
        group_id: "8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e",
        data: {
          id_number: dlNumber, // Use user input for DL number
          date_of_birth: dob,  // Use user input for Date of Birth
          advanced_details: {
            state_info: true,  // Include state info in the response
            age_info: true     // Include age info in the response
          }
        }
      });
  
      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: URL,
        headers: { 
          'Content-Type': 'application/json', 
          'account-id': ACCOUNT_ID, 
          'api-key': API_KEY
        },
        data: data
      };
  
      const response = await axios(config);
  
      if (response.data.request_id) {
        setRequestId(response.data.request_id); // Save the request_id
        Alert.alert('Success', 'Driving License request initiated. Now checking verification status...');
        console.log('Request ID:', response.data.request_id);
      } else {
        Alert.alert('Error', 'Failed to get request ID for verification.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify Driving License.');
    }
  };
  

  // Function to verify PAN card and get request_id
  // const verifyPanCard = async () => {
  //   if (!panNumber || !fullName || !dob) {
  //     Alert.alert('Error', 'Please enter PAN number, Full Name, and Date of Birth.');
  //     return;
  //   }

  //   try {
  //     const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
  //     const ACCOUNT_ID = 'd1591c99d748/6a937975-a93e-4e6e-a5dd-7aa8663f1db2'; // Replace with your actual Account ID
  //     const URL = 'https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_pan'; // IDfy PAN verification endpoint

  //     const response = await axios.post(
  //       URL,
  //       {
  //         task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1', // Replace with your task ID
  //         group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e', // Replace with your group ID
  //         data: {
  //           id_number: panNumber, // Use user input for PAN number
  //           full_name: fullName, // Use user input for full name
  //           dob: dob, // Use user input for DOB
  //         },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${API_KEY}`,
  //           'Content-Type': 'application/json',
  //           'account-id': ACCOUNT_ID,
  //         },
  //       }
  //     );

  //     if (response.data.request_id) {
  //       setRequestId(response.data.request_id); // Save the request_id
  //       Alert.alert('Success', 'PAN Card request initiated. Now checking verification status...');
  //       console.log('Request ID:', response.data.request_id);
  //     } else {
  //       Alert.alert('Error', 'Failed to get request ID for PAN verification.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert('Error', 'Failed to verify PAN card.');
  //   }
  // };
  const verifyPanCard = async () => {
    if (!panNumber || !fullName || !dob) {
      Alert.alert('Error', 'Please enter PAN number, Full Name, and Date of Birth.');
      return;
    }
  
    try {
      const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
      const ACCOUNT_ID = 'd1591c99d748/6a937975-a93e-4e6e-a5dd-7aa8663f1db2'; // Replace with your actual Account ID
      const URL = 'https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_pan';
  
      var data = JSON.stringify({
        task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1', // Replace with your task ID
        group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e', // Replace with your group ID
        data: {
          id_number: panNumber, // Use user input for PAN number
          full_name: fullName,  // Use user input for full name
          dob: dob,             // Use user input for DOB in yyyy-mm-dd format
        },
      });
  
      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: URL,
        headers: {
          'Content-Type': 'application/json',
          'account-id': ACCOUNT_ID,
          'api-key': API_KEY,
        },
        data: data,
      };
  
      const response = await axios(config);
  
      if (response.data.request_id) {
        setRequestId(response.data.request_id); // Save the request_id
        Alert.alert('Success', 'PAN Card request initiated. Now checking verification status...');
        console.log('Request ID:', response.data.request_id);
      } else {
        Alert.alert('Error', 'Failed to get request ID for PAN verification.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify PAN card.');
    }
  };
  

  // Function to check verification status using request_id
  const checkVerificationStatus = async () => {
    if (!requestId) {
      Alert.alert('Error', 'No request ID found. Please verify the document first.');
      return;
    }

    try {
      const API_KEY = '9c2e61dd-23f5-44dd-8237-c0a12c248b1a'; // Replace with your actual IDfy API key
      const ACCOUNT_ID = 'd1591c99d748/6a937975-a93e-4e6e-a5dd-7aa8663f1db2'; // Replace with your actual Account ID
      const STATUS_URL = `https://eve.idfy.com/v3/tasks?request_id=${requestId}`; // Use the request_id in the GET request

      const response = await axios.get(STATUS_URL, {
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json',
          'account-id': ACCOUNT_ID,
        },
      });

      if (response.data.status) {
        setVerificationStatus(response.data.status); // Update the verification status
        Alert.alert('Verification Status', `Verification Status: ${response.data.status}`);
        console.log(response.data);
      } else {
        Alert.alert('Error', 'Failed to fetch verification status.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to check verification status.');
    }
  };
  const verifyDocument = async () => {
    await verifyPanCard(); // Or any other verification function
    checkVerificationStatus(); // Automatically uses the stored `requestId`
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Verification (KYC)</Text>
      <Text style={styles.subtitle}>VERIFY YOUR PROFILE IN 3 EASY STEPS</Text>

      {/* Driving License Verification */}
      <TextInput
        style={styles.input}
        placeholder="Enter Driving License Number"
        value={dlNumber}
        onChangeText={(text) => setDlNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={(text) => setDob(text)}
      />
      <TouchableOpacity style={styles.button} onPress={verifyDrivingLicense}>
        <Text style={styles.buttonText}>Verify Driving License</Text>
      </TouchableOpacity>

      {/* PAN Card Verification */}
      <TextInput
        style={styles.input}
        placeholder="Enter PAN Number"
        value={panNumber}
        onChangeText={(text) => setPanNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Full Name as per PAN"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={(text) => setDob(text)}
      />
      <TouchableOpacity style={styles.button} onPress={verifyPanCard}>
        <Text style={styles.buttonText}>Verify PAN Card</Text>
      </TouchableOpacity>

      {/* Check Verification Status */}
      <TouchableOpacity style={styles.button} onPress={checkVerificationStatus}>
        <Text style={styles.buttonText}>Check Verification Status</Text>
      </TouchableOpacity>

      {/* Display verification status */}
      {verificationStatus && <Text style={styles.statusText}>Status: {verificationStatus}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dlt;
