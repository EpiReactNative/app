import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  RefreshControl, SafeAreaView, ScrollView, StyleSheet,
} from 'react-native';
import {
  Toast,
} from 'native-base';
import { postActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import { Post } from '../components/home';

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
    postActions.getPosts()
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
      postActions.getPosts().then((data) => {
        setPosts(data);
        if (isMounted()) setMounted(true);
      }).catch(() => {
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
        contentContainerStyle={styles.scrollView}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      >
        {posts.map((post) => (
          <Post post={post} />
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
