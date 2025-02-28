import React, { useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, router } from "expo-router";
import { Animated } from 'react-native';
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useEffect } from "react";
import NoResults from "@/components/NoResults";
import Emergency from '../emergency';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get("window")
export default function Index() {
  const { user,userEmails } = useGlobalContext()
  console.log(userEmails)
  const [connectionStatus, setConnectionStatus] = useState("Disconnected")
  const [isConnected, setIsConnected] = useState(false)
  const progress = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Function to animate the circular progress bar
  const toggleConnection = () => {
    const toValue = isConnected ? 0 : 1
    Animated.timing(progress, {
      toValue,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setIsConnected(!isConnected)
      setConnectionStatus(isConnected ? "Disconnected" : "Connected")
    })
  }

  // Pulse animation for the connection button when disconnected
  useEffect(() => {
    if (!isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      pulseAnim.setValue(1)
    }
  }, [isConnected, pulseAnim])

  // Progress circle properties
  const strokeWidth = 10
  const radius = 50
  const circumference = 2 * Math.PI * radius

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Elements */}
      <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.background} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.contentContainer}>
          {/* Header with User Profile */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={{ uri: user?.avatar || "https://via.placeholder.com/100" }} style={styles.avatar} />
              <View style={styles.userTextContainer}>
                <Text style={styles.welcomeText}>Hello,</Text>
                <Text style={styles.userName}>{user?.name || "Rider"}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Icon name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Safety Status Card */}
          <View style={styles.safetyStatusContainer}>
            <Text style={styles.safetyStatusTitle}>Safety Device Status</Text>

            <Animated.View style={[styles.connectionButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity onPress={toggleConnection} style={styles.connectionButton}>
                <Svg height="180" width="180" viewBox="0 0 120 120">
                  <Circle cx="60" cy="60" r={radius} stroke="#333333" strokeWidth={strokeWidth} fill="none" />
                  <AnimatedCircle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={isConnected ? "#4CAF50" : "#FF5252"}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [circumference, 0],
                    })}
                    strokeLinecap="round"
                  />
                </Svg>
                <View style={styles.connectionStatusContainer}>
                  <Icon
                    name={isConnected ? "bluetooth-connected" : "bluetooth-disabled"}
                    size={32}
                    color={isConnected ? "#4CAF50" : "#FF5252"}
                  />
                  <Text style={[
                    styles.connectionStatusText, 
                    { color: isConnected ? "#4CAF50" : "#FF5252" }
                  ]}>
                    {connectionStatus}
                  </Text>
                  <Text style={styles.tapToConnectText}>{isConnected ? "Protected" : "Tap to connect"}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {isConnected && (
              <View style={styles.protectionActiveContainer}>
                <Icon name="shield" size={20} color="#4CAF50" />
                <Text style={styles.protectionActiveText}>Accident detection active</Text>
              </View>
            )}
          </View>

          {/* Emergency Actions */}
          <View style={styles.emergencyActionsContainer}>
            <Text style={styles.sectionTitle}>Emergency Actions</Text>

            <Link href="/emergency" asChild>
              <TouchableOpacity style={styles.emergencyButton}>
                <LinearGradient colors={["#FF5252", "#D32F2F"]} style={styles.emergencyButtonGradient}>
                  <Icon name="error" size={28} color="white" />
                  <Text style={styles.emergencyButtonText}>Emergency SOS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionsGrid}>
              <Link href="/addcontacts" asChild>
                <TouchableOpacity style={styles.actionCard}>
                  <View style={[styles.actionIconContainer, { backgroundColor: "#212121" }]}>
                    <Icon name="person-add" size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>Emergency Contacts</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/" asChild>
                <TouchableOpacity style={styles.actionCard}>
                  <View style={[styles.actionIconContainer, { backgroundColor: "#212121" }]}>
                    <Icon name="settings" size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>Device Settings</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/" asChild>
                <TouchableOpacity style={styles.actionCard}>
                  <View style={[styles.actionIconContainer, { backgroundColor: "#212121" }]}>
                    <Icon name="history" size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>Ride History</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/support" asChild>
                <TouchableOpacity style={styles.actionCard}>
                  <View style={[styles.actionIconContainer, { backgroundColor: "#212121" }]}>
                    <Icon name="contact-support" size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>Support</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Safety Tips */}
          <View style={styles.safetyTipsContainer}>
            <View style={styles.safetyTipsHeader}>
              <Text style={styles.sectionTitle}>Safety Tips</Text>
              <Link href="/" asChild>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tipsScrollContent}
            >
              <View style={styles.tipCard}>
                <Icon name="helmet-safety" size={24} color="#4CAF50" />
                <Text style={styles.tipTitle}>Always Wear a Helmet</Text>
                <Text style={styles.tipDescription}>Helmets reduce the risk of head injury by up to 85%.</Text>
              </View>

              <View style={styles.tipCard}>
                <Icon name="visibility" size={24} color="#4CAF50" />
                <Text style={styles.tipTitle}>Stay Visible</Text>
                <Text style={styles.tipDescription}>Use lights and reflective gear, especially at night.</Text>
              </View>

              <View style={styles.tipCard}>
                <Icon name="speed" size={24} color="#4CAF50" />
                <Text style={styles.tipTitle}>Watch Your Speed</Text>
                <Text style={styles.tipDescription}>Adjust your speed based on road conditions.</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Added extra padding for tab bar
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  userTextContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  safetyStatusContainer: {
    backgroundColor: "#121212",
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#333333",
  },
  safetyStatusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  connectionButtonContainer: {
    marginVertical: 10,
  },
  connectionButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  connectionStatusContainer: {
    position: "absolute",
    alignItems: "center",
  },
  connectionStatusText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
  },
  tapToConnectText: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 4,
  },
  protectionActiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  protectionActiveText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 6,
  },
  emergencyActionsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "white",
  },
  emergencyButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  emergencyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  quickActionsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 50) / 2,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  safetyTipsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  safetyTipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  tipsScrollContent: {
    paddingRight: 20,
  },
  tipCard: {
    width: 200,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 18,
  },
})