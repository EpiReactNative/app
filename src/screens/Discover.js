import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  Toast, Stack,
} from 'native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { postActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import {
  SearchBar, PostGrid, Post,
} from '../components/discover';

const DiscoverScreen = ({ route, navigation }) => (
  <Stack w="100%" h="100%">
    <SearchBar />
    <PostGrid navigation={navigation} posts={route.params.posts} />
  </Stack>
);

const DiscoverStack = createNativeStackNavigator();

function DiscoverStackScreen() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState([]);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      postActions
        .getPosts()
        .then((data) => {
          setPosts(data);
          if (isMounted()) setMounted(true);
        })
        .catch(() => {
          Toast.show(toasts.globalError);
        });
    }
  }, []);

  if (!mounted || !posts) {
    return <Loading />;
  }

  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen name="DiscoverScreen" component={DiscoverScreen} initialParams={{ posts }} options={{ headerShown: false }} />
      <DiscoverStack.Screen
        name="OpenPost"
        component={Post}
        options={{
          title: '',
        }}
      />
      {/* <DiscoverStack.Screen
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
  route: PropTypes.shape({
    params: PropTypes.shape({
      posts: PropTypes.shape({
        id: PropTypes.number.isRequired,
        author: PropTypes.shape({
          username: PropTypes.string.isRequired,
          profile_picture: PropTypes.string.isRequired,
        }).isRequired,
        image: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
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
