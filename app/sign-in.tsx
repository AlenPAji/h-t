import {View, Text,Alert, SafeAreaView, ScrollView, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import images from "@/constants/images";
import icons from "@/constants/icons";
import {login, logout} from "@/lib/appwrite";
import {useGlobalContext} from "@/lib/global-provider";
import {Redirect} from "expo-router";
import {StyleSheet, ImageBackground} from 'react-native';


const SignIn = () => {
    const {refetch,loading,isLogged}=useGlobalContext();
    if(!loading && isLogged) return <Redirect href="/" />
    const handleLogin = async () => {
        const result = await login();
        if (result) {
          refetch({});
        } else {
          Alert.alert("Error", "Failed to login");
        }
      };
    return (
        <View style={styles.mainContainer}>
        {/* Title */}
        <Text style={styles.title}>
            WELCOME TO SAFE RIDE
        </Text>

        {/* Image Background - 70% of the screen */}
        <ImageBackground
            source={require('../assets/images/bike2.jpg')} // Your image path
            style={styles.background}
        />

        {/* Description Text */}
        <Text style={styles.des}>
            Ride Smart, Stay Safe
        </Text>

        {/* Login Text */}
        <Text style={styles.login}>
            Login to Safe Ride with Google
        </Text>

        {/* Button with Google Logo */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Image
                source={require('../assets/images/google-logo.jpg')} // Your Google logo path
                style={styles.googleLogo}
            />
            <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Remaining 30% of the screen with #d0dde5 background */}
        <View style={styles.remainingContainer}>
            {/* Add content if needed */}
        </View>
    </View>
);
}

const styles = StyleSheet.create({
mainContainer: {
    flex: 1, // Full height of the screen
    backgroundColor: 'white', // Set the background color of the full container
    alignItems: 'center', // Center the content horizontally
},
background: {
    width: '100%', // Make the image span the full width of the screen
    height: '73%', // Make the image span 70% of the screen height
},
remainingContainer: {
    height: '30%', // Explicitly set the height to 30% of the screen
    backgroundColor: 'white', // Background color for the remaining area
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center', // Horizontally center the content
},
title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
    marginTop: 66,
    marginBottom: 25,
    fontFamily: 'Poppins_700Bold',



},
des: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    //fontStyle: 'italic',
    marginTop: -135,
    fontFamily: 'Poppins_700Bold',

},
login: {
    fontSize: 20,
    textAlign: 'center',
    color: 'gray',
    marginTop: 25,
    fontFamily: 'Poppins_500Medium',

},
button: {
    flexDirection: 'row', // Align logo & text in a row
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 25, // Adds space between the text and the button
    alignItems: 'center', // Centers items inside the button
    justifyContent: 'center', // Centers text and logo horizontally
    width: 280, // Reduce button width
},
googleLogo: {
    width: 24,  // Adjust Google logo size
    height: 24,
    marginRight: 10, // Add space between logo and text
},
buttonText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
},
});

           
export default SignIn
