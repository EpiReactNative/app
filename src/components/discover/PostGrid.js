import React from 'react';
import PropTypes from 'prop-types';
import {
  Stack, Box, Image,
} from 'native-base';
import {
  Dimensions, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const PostGrid = ({ posts, navigation }) => {
  const onClickPost = (post) => {
    navigation.navigate('OpenPost', { post });
  };

  return (
    <Stack>
      <ScrollView
        contentContainerStyle={styles.scrollView}
      >
        {posts.map((post) => (
          <Box key={post.id} w="33%" m="0.3">
            <TouchableOpacity onPress={() => onClickPost(post)}>
              <Image
                resizeMode="cover"
                source={{ uri: post.image }}
                alt="Post Image"
                width={Dimensions.get('window').width / 3}
                height={Dimensions.get('window').width / 3}
              />
            </TouchableOpacity>
          </Box>
        ))}
      </ScrollView>
    </Stack>
  );
};

export default PostGrid;

PostGrid.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  posts: PropTypes.array.isRequired,
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
