import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Toast, Stack, ZStack, Spinner, Icon, Text, Center,
} from 'native-base';
import _ from 'lodash';
import { userActions, authenticationActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import Post from '../components/Post';
import UserScreen from '../components/UserScreen';
import PostScreen from '../components/PostScreen';

function HomeScreen({ route, navigation }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const limit = 5;
  const [offset, setOffset] = useState(0);

  const loadMore = _.debounce(() => {
    userActions.getNews(limit, offset).then((data) => {
      if (data.results.length) {
        setPosts([...posts, ...data.results]);
        setOffset(offset + data.results.length);
      }
      setLoading(false);
    }).catch(() => {
      Toast.show(toasts.globalError);
      setLoading(false);
    });
  }, 250);

  const fetchData = async () => {
    setMounted(false);
    userActions.whoami().then(() => {
      userActions
        .getNews(limit, 0)
        .then((data) => {
          setPosts(data.results);
          setOffset(0 + data.results.length);
          setMounted(true);
        })
        .catch(() => {
          Toast.show(toasts.globalError);
        });
    }).catch(() => {
      Toast.show(toasts.globalError);
      authenticationActions.logout();
    });
  };

  useEffect(() => {
    async function myAsyncEffect() {
      await fetchData();
    }

    myAsyncEffect();
    // Comment éviter le boucle inf si on ajoute fetchData() dans les dépendances du useEffect ?
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) {
    return <Loading />;
  }

  if (!posts.length) {
    return (
      <Center h="100%" flex={1}>
        <Icon as={MaterialCommunityIcons} name="emoticon-sad-outline" color="light.500" />
        <Text semibold color="light.500">Rien à afficher</Text>
      </Center>
    );
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={fetchData} />
      }
      onScroll={({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent)) {
          setLoading(true);
          loadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      <Stack w="100%" pb="10">
        {posts.map((post) => (
          <Post key={post.id} targetPost={post} route={route} navigation={navigation} />
        ))}
        {loading && (
          <ZStack mt="2" justifyContent="center" alignItems="center">
            <Spinner size="lg" color="#262626" />
          </ZStack>
        )}
      </Stack>
    </ScrollView>
  );
}

const ProfilStack = createNativeStackNavigator();

function ProfilStackScreen() {
  return (
    <ProfilStack.Navigator>
      <ProfilStack.Screen
        name="News"
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
      <ProfilStack.Screen name="User" component={UserScreen} options={{ title: '' }} initialParams={{ id: -1 }} />
      <ProfilStack.Screen name="Post" component={PostScreen} options={{ title: 'Publications' }} />
    </ProfilStack.Navigator>
  );
}

export default ProfilStackScreen;

HomeScreen.propTypes = {
  route: PropTypes.shape({}).isRequired,
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
