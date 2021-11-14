import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  HStack, Image, Toast, ScrollView, Stack, ZStack,
  Spinner, Text, Center, Icon,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { Dimensions, Pressable } from 'react-native';
import { userActions } from '../../redux/actions';
import toasts from '../../redux/helpers/toasts';

const PostsContainer = ({ navigation, user, name }) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(undefined);
  const limit = 12;
  const [offset, setOffset] = useState(0);
  const width = (Dimensions.get('window').width - 6) * (1 / 3);
  const height = width;
  const get = {
    posts: userActions.getPosts,
    likes: userActions.getLikes,
  };

  const loadMore = _.debounce(() => {
    get[name](user.id, limit, offset).then((data) => {
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
      get[name](user.id, limit, 0).then((data) => {
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

  const goToPost = (post) => {
    navigation.push('Post', { post });
  };

  const renderItem = ({ chunk }) => (
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

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <Stack h="100%" alignItems="center">
      {posts.length === 0 ? (
        <Center h="100%" flex={1}>
          <Icon as={MaterialCommunityIcons} name="emoticon-sad-outline" color="light.500" />
          <Text semibold color="light.500">Rien à afficher</Text>
        </Center>
      ) : (
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
          h="100%"
        >
          <Stack h="100%" pb="8">
            {getChunks().map((chunk) => renderItem({ chunk }))}
            {loading && (
              <ZStack mt="4" justifyContent="center" alignItems="center">
                <Spinner color="#262626" />
              </ZStack>
            )}
          </Stack>
        </ScrollView>
      )}
    </Stack>
  );
};

export default PostsContainer;

PostsContainer.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
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
