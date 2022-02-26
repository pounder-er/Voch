import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import Login from './Login';
import Home from './Home';
import Forgotpass from './Forgotpass';
import Registration from './Registration';
import Profile from './Profile';
import Friend from './Friend';
import Chat from './Chat';
import Splash from './Splash';

import configureStore from './Store'
import { Provider } from 'react-redux'

const LoginScreen = () => {
  const navigation = useNavigation();
  return <Login navigation={navigation} />;
}

const ForgotpassScreen = () => {
  const navigation = useNavigation();
  return <Forgotpass navigation={navigation} />;
}

const RegistrationScreen = () => {
  const navigation = useNavigation();
  return <Registration navigation={navigation} />;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  return <Home navigation={navigation} />;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  return <Profile navigation={navigation} />;
}

const FriendScreen = () => {
  const navigation = useNavigation();
  return <Friend navigation={navigation} />;
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  return <Chat navigation={navigation} route={route} />;
}

const SplashScreen = () => {
  const navigation = useNavigation();
  return <Splash navigation={navigation}/>;
}







const Stack = createStackNavigator();
const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }} />
      <Stack.Screen name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} />
      <Stack.Screen name="Forgotpass"
        component={ForgotpassScreen}
        options={{ headerShown: false }} />
      <Stack.Screen name="Registration"
        component={RegistrationScreen}
        options={{ headerShown: false }} />
        <Stack.Screen name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }} />
      <Stack.Screen name="BottomTab"
        component={MyBottomTab}
        options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function MyBottomTab() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#ecbcb0',
        style:{height:50},
        tabStyle:{padding:5}

      }}>
      <Tab.Screen options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="ios-home" size={24} color={color} />
        )
      }} name="Home" component={HomeScreen} />
      <Tab.Screen options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="users" size={24} color={color} />
        )
      }} name="Friend" component={FriendScreen} />
      <Tab.Screen options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="user-edit" size={24} color={color} />
        )
      }} name="Profile" component={ProfileScreen} />
      
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={configureStore}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </Provider>
    //<Registration/>

  );
}
