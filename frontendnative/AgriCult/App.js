import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import SplashScreen from "./components/splashScreen/SplashScreen";
import BuyerRegistration from "./components/ResgistrationPage/BuyerRegistration";
import SellerRegistration from "./components/ResgistrationPage/SellerRegistration";
import OTPVerification from "./components/ResgistrationPage/OTPVerification";
import BuyerHomeScreen from "./components/BuyerHomeScreen/BuyerHomeScreen";
import SellerHomeScreen from "./components/SellerHomeScreen/SellerHomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OrderScreen from "./components/BuyerHomeScreen/OrderScreen";
import OrderDetailScreen from "./components/OrderDetailScreen";
import login from "./components/ResgistrationPage/login";
import NewLogin from "./components/ResgistrationPage/newlogin";
import Chat from "./components/ChatScreen/Chat";
import ChatList from "./components/ChatScreen/ChatList";
import PastBidsScreen from "./components/SellerHomeScreen/PastBidsScreen";
import BidDetailPage from "./components/BuyerHomeScreen/bidDetailPage";

const Stack = createStackNavigator();

const UserTypeSelection = ({ navigation }) => {
  return (
    // <View style={styles.selectionContainer}>
    //   {/* <Text style={styles.selectionText}>Choose your account type:</Text> */}
      

    //   {/* <TouchableOpacity
    //     style={styles.button}
    //     onPress={() => navigation.navigate("BuyerRegistration")}
    //   >
    //     <Text style={styles.buttonText}>Register as Buyer</Text>
    //   </TouchableOpacity>

    //   <TouchableOpacity
    //     style={styles.button}
    //     onPress={() => navigation.navigate("SellerRegistration")}
    //   >
    //     <Text style={styles.buttonText}>Register as Seller</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity
    //     style={styles.button}
    //     onPress={() => navigation.navigate("login")}
    //   >
    //     <Text style={styles.buttonText}>Login</Text>
    //   </TouchableOpacity> */}
    // </View>
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="NewLogin">
    //     <Stack.Screen 
    //       name="NewLogin" 
    //       component={NewLogin} 
    //       options={{ headerShown: false }} // Hides the default header
    //     />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <View>

    </View>
  );
};

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    // Show the Splash Screen while loading
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NewLogin" mode="modal" screenOptions={{ headerShown: false }}>
        {/* User Type Selection Screen */}
        <Stack.Screen 
          name="NewLogin" 
          component={NewLogin} 
          options={{ headerShown: false }} // Hides the default header
        />
        <Stack.Screen name="PastBidsScreen" component={PastBidsScreen} />
        <Stack.Screen 
          name="ChatList" 
          component={ChatList}
        />
        
        <Stack.Screen 
          name="ChatInterface" 
          component={Chat}
        />
        
        <Stack.Screen
          name="UserTypeSelection"
          component={UserTypeSelection}
          options={{ headerShown: false }} // Hide the header
        />

        {/* Buyer Registration Screen */}
        <Stack.Screen
          name="BuyerRegistration"
          component={BuyerRegistration}
          options={{ headerShown: false }} // Hide the header
        />
        <Stack.Screen
          name="login"
          component={login}
          options={{ headerShown: false }} // Hide the header
        />
        <Stack.Screen
         name="newLogin"
         component={NewLogin}
         options={{ headerShown: false }} // Hide the header
       />

        {/* Seller Registration Screen */}
        <Stack.Screen
          name="SellerRegistration"
          component={SellerRegistration}
          options={{ headerShown: false }} // Hide the header
        />
        <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />

        {/* OTP Verification Screen */}
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerification}
          options={{ title: "Verify OTP" }} // Show a title in the header
        />

        {/* Buyer Home Screen */}
        <Stack.Screen
          name="BuyerHomeScreen"
          component={BuyerHomeScreen}
          options={{
            title: "AGRICULT",
            headerStyle: {
              backgroundColor: 'green',
              height: 100,
              elevation: 20
            },
            headerTintColor: '#ffffff',
            headerLeft: () => null, // Removes the back button
          }}
        />



        {/* Seller Home Screen */}
        <Stack.Screen
          name="SellerHomeScreen"
          component={SellerHomeScreen}
          options={{ headerShown: false }} // Customize title if needed
        />
        <Stack.Screen name="PlaceOrder" component={OrderScreen} />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ title: "Order Details" }}
        />
      <Stack.Screen name = "Chat" component={Chat}/>
      <Stack.Screen name="BidDetailPage" component={BidDetailPage} options={{ title: "Collection Center" }}/>
      

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 20,
  },
  selectionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
