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
import { userActions } from '../redux/actions';

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
  const [loading, setLoading] = useState(false);

  // const getImageSize = (image) => {
  //   const { width } = Dimensions.get('window');
  //   const height = image.offsetHeight / (image.offsetWidth / width);
  //   return { width, height };
  // };

  const [items, setItems] = useState([]);
  const limit = 8;
  const [offset, setOffset] = useState(0);
  // const get = userActions.getPosts,

  const loadMore = _.debounce(() => {
    console.log("Dans loadMore")

      postActions.getPosts(limit, offset).then((data) => {
        console.log(data)
      if (data.results.length) {
        setItems([...items, ...data.results]);
        setOffset(offset + data.results.length);
      }
      setLoading(false);
    }).catch((error) => {
      console.log(error)
      Toast.show(toasts.globalError);
      setLoading(false);
    });
  }, 500);

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
  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          if (!loading && isCloseToBottom(nativeEvent)) {
            setLoading(true);
            loadMore();
          }
        }}
        scrollEventThrottle={400}
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
