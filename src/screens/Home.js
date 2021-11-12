import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Text, Toast, HStack, VStack, Image,
} from 'native-base';
import { postActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import config from '../redux/helpers/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function HomeScreen() {
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  // const getImageSize = (image) => {
  //   const { width } = Dimensions.get('window');
  //   const height = image.offsetHeight / (image.offsetWidth / width);
  //   return { width, height };
  // };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    postActions
      .getPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch(() => {
        Toast.show(toasts.globalError);
      })
      .then(() => setRefreshing(false));
  }, []);

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

  if (!mounted) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post) => (
          <VStack my="2" key={post.id} width="100%">
            <HStack p="3" w="100%" display="flex" alignItems="center">
              <Image
                style={{ overlayColor: 'rgb(242, 242, 242)' }} // handle GIF images rounded
                resizeMode="cover"
                source={{ uri: `${config.SERVER_URL}${post.author.profile_picture}` }}
                width="40px"
                height="40px"
                alt="Profil Picture"
                rounded="full"
              />
              <Text ml="3" bold fontSize="md">{post.author.username}</Text>
            </HStack>
            <Image
              source={{ uri: post.image }}
              alt="Post"
              width={Dimensions.get('window').width}
              height={post.height * (Dimensions.get('window').width / post.width)}
            />
            <VStack p="3" width="100%">
              {post.caption !== '' && (
                <HStack display="flex" alignItems="center">
                  <Text mr="2" bold>{post.author.username}</Text>
                  <Text>{post.caption}</Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
export default HomeScreen;

HomeScreen.propTypes = {
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
