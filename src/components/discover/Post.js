import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import {
  Text, Image, HStack, Box, VStack, Stack, Button, Icon, Spinner, Toast,
} from 'native-base';
import config from '../../redux/helpers/config';
import { postActions } from '../../redux/actions';
import toasts from '../../redux/helpers/toasts';

const Post = ({ route, navigation }) => {
  const [editing, setEditing] = useState(false);
  const [post] = useState({
    id: route.params.post.id,
    author: route.params.post.author,
    image: route.params.post.image,
    caption: route.params.post.caption,
  });
  const [author] = useState({
    username: route.params.post.author.username,
    image: {
      uri: `${config.SERVER_URL}${route.params.post.author.profile_picture}`,
    },
  });

  useLayoutEffect(() => {
    const handleSubmit = () => {
      setEditing(true);
      console.log(post.id);
      postActions.deletePosts(post.id).then(() => {
        setEditing(false);
        Toast.show(toasts.deleteSuccess);
        navigation.popToTop();
      }).catch((error) => {
        console.log(error);
        Toast.show(toasts.globalError);
        setEditing(false);
      });
    };

    navigation.setOptions({
      headerRight: () => (
        <Stack>
          {editing ? (
            <Stack mr="5">
              <Spinner color="#06B6D4" />
            </Stack>
          ) : (
            <Button variant="unstyled" onPress={handleSubmit}>
              <Icon as={Ionicons} name="trash-bin-outline" size="md" color="red" />
            </Button>
          )}
        </Stack>
      ),
    });
  }, [navigation, editing, route, post]);
  return (
    <VStack w="100%" h="100%">
      <Box p="4">
        <HStack w="100%" alignItems="center" justifyContent="flex-start">
          <Image
            resizeMode="cover"
            source={{ uri: author.image.uri }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: '#d6d3d1',
            }}
            alt="Image User"
          />
          <Text ml="3" fontWeight="bold" fontSize={18}>
            {author.username}
          </Text>
        </HStack>
      </Box>
      <Box w="100%">
        <Image
          resizeMode="cover"
          source={{ uri: post.image }}
          alt="Post Image"
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').width}
        />
      </Box>
      <Box p="4">
        <HStack justifyContent="flex-start">
          <Ionicons mh="8" name="heart-outline" size={40} color="black" />
          <Ionicons mh="8" style={{ marginLeft: 8 }} name="chatbubble-outline" size={40} color="black" />
        </HStack>
        <HStack mt="4">
          <Text fontWeight="bold" fontSize={16}>{author.username}</Text>
          <Text ml="2" fontSize={16}>
            {post.caption}
            {' '}
          </Text>
        </HStack>
      </Box>
      {/* <Box>
        commentaires
      </Box> */}
    </VStack>
  );
};

export default Post;

Post.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      post: PropTypes.shape({
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
    setOptions: PropTypes.func.isRequired,
    popToTop: PropTypes.func.isRequired,
    state: PropTypes.shape({
      key: PropTypes.string.isRequired,
      routeName: PropTypes.string.isRequired,
      path: PropTypes.string,
      params: PropTypes.objectOf(PropTypes.object),
    }),
  }).isRequired,
};
