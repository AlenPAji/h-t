import React, { useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Updated import for Expo
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, router } from "expo-router";
import { Animated } from 'react-native';
import {useGlobalContext} from "@/lib/global-provider";
import {useAppwrite} from "@/lib/useAppwrite";
import {getLatestProperties, getProperties} from "@/lib/appwrite";
import {useEffect} from "react";
import NoResults from "@/components/NoResults";
import Emergency from '../emergency';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Index() {
    const {user}=useGlobalContext();
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [isConnected, setIsConnected] = useState(false);
    const progress = useRef(new Animated.Value(0)).current; // Progress animation value

    // Function to animate the circular progress bar
    const toggleConnection = () => {
        const toValue = isConnected ? 0 : 1; // Toggle between 0 and 1
        Animated.timing(progress, {
            toValue,
            duration: 1000, // Animation duration in milliseconds
            useNativeDriver: false,
        }).start(() => {
            setIsConnected(!isConnected);
            setConnectionStatus(isConnected ? "Disconnected" : "Connected");
        });
    };

    // Progress circle properties
    const strokeWidth = 10;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    return (
        <View style={styles.container}>
            {/* Background Elements */}
            <View style={styles.backgroundContainer}>
                <View style={styles.solidBlack} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
                    style={styles.gradient}
                />
            </View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 0, marginTop: 20 }}>
    <Image source={{ uri: user?.avatar }} style={{ width: 48, height: 48, borderRadius: 24 }} />
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginLeft: 10 }}>
        {user?.name}
    </Text>
</View>

                {/* Circular Button with Animated Progress */}
                <TouchableOpacity onPress={toggleConnection} style={styles.button}>
                    <Svg height="210" width="210" viewBox="0 0 120 120">
                        {/* Background Circle (Gray) */}
                        <Circle cx="60" cy="60" r={radius} stroke="#E0E0E0" strokeWidth={strokeWidth} fill="none" />
                        {/* Progress Circle (Black) */}
                        <AnimatedCircle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="black"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [circumference, 0], // Animates from full to empty
                            })}
                            strokeLinecap="round"
                        />
                    </Svg>
                    <Text style={styles.buttonText}>{connectionStatus}</Text>
                </TouchableOpacity>

                <Text style={styles.text2}>Quick Actions</Text>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <Link href="/addcontacts" asChild>
                        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                            <Icon name="person-add" size={40} color="black" />
                            <Text style={styles.iconText}>Add Contacts</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/emergency" asChild>
                         <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                            <Icon name="error" size={40} color="black" />
                            <Text style={styles.iconText}>Emergency</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
                <Link href="/support" asChild>
                    {/* Settings Button */}
                    <TouchableOpacity
                        style={styles.iconButton1}
                        activeOpacity={0.7}
                    >
                        <Icon name="contact-support" size={40} color="black" />
                        <Text style={styles.iconText1}>Support</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        zIndex: 2,
    },
    solidBlack: {
        width: '230%',
        height: '48%',
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        left: '-25%',
        transform: [{ rotate: '28deg' }],
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        //fontStyle: 'italic',
        marginTop: 35,
        color: 'white',
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    text1: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 38,
        color: 'white',
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    securelogo: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 38,
        right: 10,
    },
    button: {
        width: 210,
        height: 210,
        borderRadius: 110,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        position: 'relative',
        marginTop: 40,
    },
    buttonText: {
        position: 'absolute',
        fontSize: 23,
        fontWeight: 'bold',
        color: 'black',
    },
    text2: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 35,
        color: 'black',
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    iconButton: {
        alignItems: 'center',
        padding: 10,
    },
    iconText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
    },
    iconButton1: {
        alignItems: 'center',
        padding: 10,
        marginTop: 25,
        alignSelf: 'flex-start',
        marginLeft: 65,
    },
    iconText1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
    },
});