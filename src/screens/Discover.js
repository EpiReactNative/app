import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import {
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Toast, Stack, ZStack, Spinner, Icon, Text, Center, Input,
  HStack, Pressable, Image, VStack,
} from 'native-base';
import _ from 'lodash';
import { userActions, postActions, authenticationActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import UserScreen from '../components/UserScreen';
import PostScreen from '../components/PostScreen';

function SearchScreen({ navigation }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const limit = 18;
  const [offset, setOffset] = useState(0);
  const width = (Dimensions.get('window').width - 6) * (1 / 3);
  const height = width;

  const loadMore = _.debounce(() => {
    postActions.getPosts(limit, offset).then((data) => {
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
      postActions
        .getPosts(limit, 0)
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

  const onSearch = _.debounce((value) => {
    if (!value || value.length < 3) {
      setResults([]);
      return;
    }
    userActions.searchUsers({ search: value }).then((data) => {
      setResults(data);
    }).catch(() => {
      Toast.show(toasts.globalError);
    });
  }, 500);

  const goToPost = (post) => {
    navigation.push('Post', { post });
  };

  const getMargin = (i) => {
    if (i !== 2) return '3px';
    return '0';
  };

  const renderChunk = ({ chunk }) => (
    <HStack key={chunk.id} mb="3px" w="100%" flexWrap="wrap">
      {chunk.posts.map((post, i) => (
        <Pressable
          key={post.id}
          onPress={() => goToPost(post)}
        >
          <Image
            mr={getMargin(i)}
            resizeMode="cover"
            source={{ uri: post.image }}
            alt="Post Image"
            width={width}
            height={height}
          />
        </Pressable>
      ))}
    </HStack>
  );

  // split tous les posts en row de 3 posts
  const getChunks = () => {
    const chunkSize = 3;
    return [...Array(Math.ceil(posts.length / chunkSize))]
      .map((item, i) => ({ id: i, posts: posts.slice(i * chunkSize, i * chunkSize + chunkSize) }));
  };

  const renderUser = ({ user }) => {
    const goToUser = () => {
      navigation.push('User', { id: user.id });
    };

    return (
      <HStack key={user.id} p="3" display="flex" alignItems="center">
        <Pressable onPress={goToUser}>
          <Image
            style={{ overlayColor: 'rgb(242, 242, 242)' }} // handle GIF images rounded
            resizeMode="cover"
            source={{ uri: user.profile_picture }}
            width="56px"
            height="56px"
            alt="Profil Picture"
            rounded="full"
          />
        </Pressable>
        <Pressable ml="4" onPress={goToUser}>
          <VStack>
            <Text bold fontSize="md">{user.username}</Text>
            {(user.first_name !== '' || user.last_name !== '') && (
              <Text color="light.500" fontSize="sm">
                {user.first_name}
                &nbsp;
                {user.last_name}
              </Text>
            )}
          </VStack>
        </Pressable>
      </HStack>
    );
  };

  return (
    <Stack style={{ marginTop: Constants.statusBarHeight }} h="100%" w="100%">
      <Stack p="2">
        <Input
          placeholder="Recherch>er un utilisateur"
          width="100%"
          onChangeText={onSearch}
          bg="transparent"
          InputLeftElement={(
            <Icon
              m="2"
              size="sm"
              color="gray.500"
              as={<Icon as={Ionicons} name="search-outline" size="md" color="red" />}
            />
          )}
        />
      </Stack>
      {!posts.length && !results.length ? (
        <Center h="100%" flex={1}>
          <Icon as={MaterialCommunityIcons} name="emoticon-sad-outline" color="light.500" />
          <Text semibold color="light.500">Rien à afficher</Text>
        </Center>
      ) : (
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
            {results.length ? (
              results.map((user) => renderUser({ user }))
            ) : (
              getChunks().map((chunk) => renderChunk({ chunk }))
            )}
            {loading && (
              <ZStack mt="2" justifyContent="center" alignItems="center">
                <Spinner size="lg" color="#262626" />
              </ZStack>
            )}
          </Stack>
        </ScrollView>
      )}
    </Stack>
  );
}

const ProfilStack = createNativeStackNavigator();

function ProfilStackScreen() {
  return (
    <ProfilStack.Navigator>
      <ProfilStack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <ProfilStack.Screen name="User" component={UserScreen} options={{ title: '' }} initialParams={{ id: -1 }} />
      <ProfilStack.Screen name="Post" component={PostScreen} options={{ title: 'Publications' }} />
    </ProfilStack.Navigator>
  );
}

export default ProfilStackScreen;

SearchScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
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
