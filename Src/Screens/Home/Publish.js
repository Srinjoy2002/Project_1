import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { fetchLocations } from '../../API/Location'; // Correct import path for API function
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome Icon for calendar
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width , height } = Dimensions.get('window');

const Search = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Travellers');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1))); // Set date to tomorrow

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [goingSuggestions, setGoingSuggestions] = useState([]);
  const [leavingSuggestions, setLeavingSuggestions] = useState([]);
  const [fromSelected, setFromSelected] = useState(false); // Track if "Leaving from" is selected
  const [toSelected, setToSelected] = useState(false); // Track if "Going to" is selected

  const fetchSuggestions = async () => {
    try {
      if (from || to) {
        const data = await fetchLocations(from, to);
        setGoingSuggestions(data.goingSuggestions || []);
        setLeavingSuggestions(data.leavingSuggestions || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
    }
  };




  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!fromSelected || !toSelected) {
        fetchSuggestions();
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [from, to]);



  const clearInput = (field) => {
    if (field === 'from') {
      setFrom('');
      setGoingSuggestions([]);
      setFromSelected(false);
    } else {
      setTo('');
      setLeavingSuggestions([]);
      setToSelected(false);
    }
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Close the picker
    setDate(currentDate); // Update the date
  };

  const handleSearchPress = () => {
    if (!from.trim()) {
      alert('Please enter your departure location.');
      return;
    }
    if (!to.trim()) {
      alert('Please enter your destination.');
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      alert('Departure and destination cannot be the same.');
      return;
    }
    if (!date) {
      alert('Please select a valid date.');
      return;
    }
  
    const formattedDate = date.toISOString();
    AsyncStorage.setItem('startingLocation',from.toString())
    AsyncStorage.setItem('goingLocation',to.toString())
    AsyncStorage.setItem('searchingDate',date.toString())
    navigation.navigate(activeTab === 'Travellers' ? 'PublishStarting' : 'PublishConsignmentLocation', { from, to, date: formattedDate });
  };
  

  const showPicker = () => {
    // if (Platform.OS === 'android') {
      setShowDatePicker(true);
    // }
  };

  return (
     <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          // contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
    <View style={styles.container}>
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('../../Images/background.png')}
          style={[styles.textureBackground, { width: '100%', height: '100%' }]}
          resizeMode="cover"
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Travel & Earn</Text>
      <Text style={styles.subHeader}>Search For</Text>

          </View>


          {/* Notification Icon in top-right corner */}
          <TouchableOpacity style={styles.notificationIconContainer} onPress={() => navigation.navigate('Notification')}>
            <Icon name="bell-o" size={25} color="#fff" />
          </TouchableOpacity>
          
        </ImageBackground>
        
      </View>



      {/* Tab Section */}
      <View style={styles.tabContainer}>



        {['Travellers', 'Consignments'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      {/* Form Section */}
      <View style={styles.formContainer}>
        {/* Leaving From Input */}
        <View style={styles.inputContainer}>
          <View style={styles.bulletPointRed} />
          <TextInput
            style={styles.input}
            placeholder="Leaving from"
            placeholderTextColor="#aaa"
            value={from}
            onChangeText={(text) => {
              setFrom(text);
              setFromSelected(false); // Allow re-entering locations
            }}
            // editable={!fromSelected} // Disable input once a location is selected
          />
          {goingSuggestions.length > 0 && !fromSelected && (
            <View style={styles.suggestionsContainer}>
              {goingSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionItem, styles.inlineSuggestion]}
                  onPress={() => {
                    setFrom(suggestion);
                    setGoingSuggestions([]); // Hide suggestions after selection
                    setFromSelected(true); // Mark as selected
                  }}
                >
                  <Text>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Going To Input */}
        <View style={styles.inputContainer}>
          <View style={styles.bulletPointGreen} />
          <TextInput
            style={styles.input}
            placeholder="Going to"
            placeholderTextColor="#aaa"
            value={to}
            onChangeText={(text) => {
              setTo(text);
              setToSelected(false); // Allow re-entering locations
            }}
            // editable={!toSelected} // Disable input once a location is selected
          />
          {leavingSuggestions.length > 0 && !toSelected && (
            <View style={styles.suggestionsContainer}>
              {leavingSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionItem, styles.inlineSuggestion]}
                  onPress={() => {
                    setTo(suggestion);
                    setLeavingSuggestions([]); // Hide suggestions after selection
                    setToSelected(true); // Mark as selected
                  }}
                >
                  <Text>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date Picker with Calendar Icon */}
        <View style={styles.inputContainer}>
          <Icon name="calendar" size={20} color="#aaa" style={styles.calendarIcon} />
          <TouchableOpacity style={styles.input} onPress={showPicker}>
            <Text style={styles.inputText}>{date ? date.toDateString() : 'Select Date'}</Text>
          </TouchableOpacity>
       
        
       
        </View>


        {showDatePicker && (
  <DateTimePicker
    value={date}
    mode="date"
    style={{width:50}}
    display="default"
    onChange={onChange}
    display={Platform.OS === 'ios' ? 'inline' : 'default'} // Inline for iOS
     minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Set minimum date to day after tomorrow
  
  />
)}

        {/* Search Button */}
      
<View style={{marginLeft:-20,marginRight:-20,marginBottom:-20}}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

      </View>
      </View>

      

      {/* Date Picker Modal */}
     
    </View>
    </ScrollView>
        </KeyboardAvoidingView>
  );
};

export default Search;

const styles = StyleSheet.create({
  // flex: { flex: 1 },
  container: {
    flex: 1,
    // backgroundColor: '#E73D48',
  },
  headerContainer: {
    height: 480,
    // backgroundColor:'white'
  },
  textureBackground: {
    width: '100%',
    height: '100%',
    // position: 'absolute',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 46,
    fontWeight: '900',
    marginBottom: 10,
    marginTop: -200,
  },
  subHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    position:'absolute',
    bottom:'40%'
    // top:20
  },
  notificationIconContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: -180,
    width: '90%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  activeTabText: {
    color: '#D83F3F',
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#fff',
    marginVertical: 20,
    padding: 20,
    borderRadius: 15,
    alignSelf: 'center',
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ddd',
  },
  bulletPointRed: {
    width: 10,
    height: 10,
    backgroundColor: '#D83F3F',
    borderRadius: 5,
    marginRight: 10,
  },
  bulletPointGreen: {
    width: 10,
    height: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#D83F3F',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarIcon: {
    marginRight: 10,
  },
    // Suggestions Styling
    inlineSuggestion: {
      marginRight: 10,
      paddingHorizontal: 8,
      paddingVertical: 6,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
  
    suggestionsContainer: {
      position: 'absolute',
      top: 45, 
      left: 0,
      right: 0,
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 5,
      zIndex: 1,
    },
  
    suggestionItem: {
      marginRight: 10,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#ddd',
    },
});
