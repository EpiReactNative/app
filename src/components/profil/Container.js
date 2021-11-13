import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  HStack, Image, Box, Center, Icon, Toast, ScrollView, Stack, ZStack,
  Spinner,
} from 'native-base';
import _ from 'lodash';
import { Dimensions, Pressable } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import config from '../../redux/helpers/config';
import { userActions } from '../../redux/actions';
import toasts from '../../redux/helpers/toasts';

const LikesScreen = () => <Center flex={1}>Likes Screen</Center>;

const initialLayout = { width: Dimensions.get('window').width };

const PostsScreen = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(undefined);
  const limit = 12;
  const [offset, setOffset] = useState(0);
  const width = (Dimensions.get('window').width - 6) * (1 / 3);
  const height = width;

  const loadMore = _.debounce(() => {
    userActions.getPosts(user.id, limit, offset).then((data) => {
      if (data.results.length) {
        setPosts([...posts, ...data.results]);
        setOffset(offset + data.results.length);
      }
      setLoading(false);
    }).catch(() => {
      Toast.show(toasts.globalError);
      setLoading(false);
    });
  }, 500);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      userActions.getPosts(user.id, limit, 0).then((data) => {
        setPosts(data.results);
        setOffset(0 + data.results.length);
        if (isMounted()) setMounted(true);
      }).catch(() => {
        Toast.show(toasts.globalError);
      });
    }
  }, []);

  // split tous les posts en row de 3 posts
  const getChunks = () => {
    const chunkSize = 3;
    return [...Array(Math.ceil(posts.length / chunkSize))]
      .map((item, i) => ({ id: i, posts: posts.slice(i * chunkSize, i * chunkSize + chunkSize) }));
  };

  const getMargin = (i) => {
    if (i !== 2) return '3px';
    return '0';
  };

  if (!mounted) {
    return null;
  }

  const renderItem = ({ chunk }) => (
    <HStack key={chunk.id} mb="3px" w="100%" flexWrap="wrap">
      {chunk.posts.map((post, i) => (
        <Image
          mr={getMargin(i)}
          key={post.id}
          resizeMode="cover"
          source={{ uri: `${config.SERVER_URL}${post.image}` }}
          alt="Post Image"
          width={width}
          height={height}
        />
      ))}
    </HStack>
  );

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <ScrollView
      data={getChunks}
      renderItem={renderItem}
      onScroll={({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent)) {
          setLoading(true);
          loadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      <Stack pb="8">
        {getChunks().map((chunk) => renderItem({ chunk }))}
        {loading && (
          <ZStack mt="4" justifyContent="center" alignItems="center">
            <Spinner color="#262626" />
          </ZStack>
        )}
      </Stack>
    </ScrollView>
  );
};

function ProfilContainer({ user }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'PostsScreen', icon: 'grid' },
    { key: 'LikesScreen', icon: 'heart' },
  ]);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'PostsScreen':
        return <PostsScreen user={user} />;
      case 'LikesScreen':
        return <LikesScreen />;
      default:
        return null;
    }
  };

  const renderTabBar = ({ navigationState }) => (
    <Center mb="1">
      <HStack w="50%" justifyContent="space-between" alignItems="center">
        {navigationState.routes.map((route, i) => {
          const borderColor = index === i ? '#262626' : 'transparent';
          return (
            <Pressable
              key={route.key}
              onPress={() => setIndex(i)}
            >
              <Box
                borderBottomWidth="3"
                borderColor={borderColor}
                alignItems="center"
                py="2"
                px="5"
              >
                {index === i ? (
                  <Icon as={Ionicons} name={route.icon} size="sm" color="#262626" />
                ) : (
                  <Icon as={Ionicons} name={`${route.icon}-outline`} size="sm" color="#262626" />
                )}
              </Box>
            </Pressable>
          );
        })}
      </HStack>
    </Center>
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      user={user}
    />
  );
}

export default ProfilContainer;

ProfilContainer.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

PostsScreen.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};
