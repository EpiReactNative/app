import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
/* eslint-disable camelcase */
import { useFonts, LeckerliOne_400Regular } from '@expo-google-fonts/leckerli-one';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
import {
  HomeScreen,
  DiscoverScreen,
  UploadScreen,
  ProfilScreen,
} from './screens';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [fontsLoaded] = useFonts({
    LeckerliOne_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: () => null,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'UploadStackScreen') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#262626',
        tabBarInactiveTintColor: '#262626',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Epigram',
          headerStyle: {
          },
          headerShown: true,
          headerTintColor: '#000',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'LeckerliOne_400Regular',
            fontSize: 30,
          },
        }}
      />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="UploadStackScreen" component={UploadScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
