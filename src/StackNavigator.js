import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAsyncEffect } from 'use-async-effect';
import TabNavigator from './TabNavigator';
import asyncStorageMethods from './redux/helpers/async-storage';
import { authenticationConstants } from './redux/constants';
import { LoginScreen, RegisterScreen } from './screens';

const Stack = createNativeStackNavigator();

function Navigation() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.authentication);

  useAsyncEffect(async (isMounted) => {
    const token = await asyncStorageMethods.getStorage('token');
    if (isMounted() && token) dispatch({ type: authenticationConstants.LOGIN_SUCCESS, token });
  }, []);

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
