import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet,
} from 'react-native';
import {
  Toast, Stack
} from 'native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { postActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import { Ionicons } from '@expo/vector-icons';
import {
  SearchBar, PostGrid
} from '../components/discover';

const DiscoverScreen = ({ route, navigation }) => {
  return (
    <Stack w="100%" h="100%">
      <SearchBar/>
      <PostGrid/>
    </Stack>
  );
};

const DiscoverStack = createNativeStackNavigator();

function DiscoverStackScreen() {

  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen name="Discover" component={DiscoverScreen} options={{ headerShown: false }} />
      {/* <DiscoverStack.Screen
        name="OpenPost"
        component={PostScreen}
        initialParams={{  }}
        options={{
          title: 'Post',
        }}
      />
       <DiscoverStack.Screen
        name="OpenProfil"
        component={ProfilScreen}
        initialParams={{  }}
        options={{
          title: 'Profil',
        }}
      /> */}
    </DiscoverStack.Navigator>
  );
}

export default DiscoverStackScreen;

DiscoverScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    state: PropTypes.shape({
      key: PropTypes.string.isRequired,
      routeName: PropTypes.string.isRequired,
      path: PropTypes.string,
      params: PropTypes.objectOf(PropTypes.object),
    }),
  }).isRequired,
};

