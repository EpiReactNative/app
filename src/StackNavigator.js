import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAsyncEffect } from 'use-async-effect';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import TabNavigator from './TabNavigator';
import asyncStorageMethods from './redux/helpers/async-storage';
import { authenticationConstants } from './redux/constants';
import { LoginScreen, RegisterScreen } from './screens/authentication';

const Stack = createNativeStackNavigator();

function Navigation() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.authentication);
  const [mounted, setMounted] = useState(false);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      asyncStorageMethods.getStorage('token').then((token) => {
        if (token) dispatch({ type: authenticationConstants.LOGIN_SUCCESS, token });
        if (isMounted()) setMounted(true);
      });
    }
  }, []);

  if (!mounted) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
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
