// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import {
  HomeScreen,
  DiscoverScreen,
  UploadScreen,
  ProfilScreen,
  LoginScreen,
  RegisterScreen,
} from './screens';

const Stack = createNativeStackNavigator();

function Navigation() {
  const isLoggedIn = useSelector((state) => state.authentication.isLoggedIn);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Discover" component={DiscoverScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Profil" component={ProfilScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Navigation;
