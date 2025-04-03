import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, Alert } from 'react-native';

const WebViewScreen = ({ route, navigation }) => {
    const { url } = route.params; // Get the URL from navigation params

    const handleNavigationChange = async (navState) => {
        const { url } = navState;

        if (url.includes('/payment/wallet-razorpay-response') || url.includes('/payment/wallet-razorpay-success')) {
            try {
                // Make an HTTP GET request to the server to get the JSON response
                const response = await fetch(url);
                const data = await response.json();

                // Log the JSON response
                console.log(data);

             
                if(data.msg == 'cancelled'){
                    navigation.goBack()
                }
                else if(data.msg=='success'){
                    // navigation.navigate('succes')
                    navigation.goBack()

                }
                else{
                    alert('An Error Occured.Please Try Again Later')
                    navigation.goBack()


                }


                // Optionally, navigate to another screen or perform further actions
                // navigation.navigate('SomeOtherScreen');

            } catch (error) {
                // Handle any errors during the fetch request
                console.error('Error fetching JSON response:', error);
                Alert.alert('Error', 'An error occurred while processing the payment.');
            }
        }
    };

    return (
        <View style={{ flex: 1,marginTop:40 }}>
            <WebView
                source={{ uri: url }}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="small" color="#0E8DF1" />}
                onNavigationStateChange={handleNavigationChange}
            />
        </View>
    );
};

export default WebViewScreen;
