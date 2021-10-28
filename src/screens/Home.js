import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet,
} from 'react-native';
import {
  Text, Toast, Box, Image,
} from 'native-base';
import { postActions } from '../redux/actions';
import Loading from '../components/Loading';

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    postActions.getPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch(() => {
        Toast.show({
          title: 'Une erreur est survenue',
          status: 'error',
          placement: 'top',
        });
      })
      .then(() => setRefreshing(false));
  }, []);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      postActions.getPosts().then((data) => {
        console.log(data);
        setPosts(data);
        if (isMounted()) setMounted(true);
      }).catch(() => {
        Toast.show({
          title: 'Une erreur est survenue',
          status: 'error',
          placement: 'top',
        });
      });
    }
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  // return (
  //   <Stack w="100%">
  //     {posts.map((post) => (
  //       <Box key={post.id} w="100%" mb="4">
  //         <Text>{post.author}</Text>
  //         <Image
  //           resizeMode="cover"
  //           source={{ uri: post.image }}
  //           alt="Post Image"
  //           width={Dimensions.get('window').width}
  //           height={Dimensions.get('window').width}
  //         // width={getImageSize().width}
  //         // height={getImageSize().height}
  //         />
  //       </Box>
  //     ))}
  //   </Stack>
  // );

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
          <Box key={post.id} w="100%" mb="4">
            <Text>{post.author}</Text>
            <Image
              resizeMode="cover"
              source={{ uri: post.image }}
              alt="Post Image"
              width={Dimensions.get('window').width}
              height={Dimensions.get('window').width}
            // width={getImageSize().width}
            // height={getImageSize().height}
            />
          </Box>
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
