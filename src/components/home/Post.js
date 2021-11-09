import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import {
  Text,
  Image,
  HStack,
  Box,
} from 'native-base';
import config from '../../redux/helpers/config';

const Post = ({ post }) => {
  const [author] = useState({
    username: post.author.username,
    image: {
      uri: `${config.SERVER_URL}${post.author.profile_picture}`,
    },
  });

  return (

    <Box mb="5">
      <Box w="100%" h="100%" flex={1} p="4">
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
          <Ionicons
            mh="8"
            style={{ marginLeft: 8 }}
            name="chatbubble-outline"
            size={40}
            color="black"
          />
        </HStack>
        <HStack mt="4">
          <Text fontWeight="bold" fontSize={16}>
            {author.username}
          </Text>
          <Text ml="2" fontSize={16}>
            {post.caption}
            {' '}
          </Text>
        </HStack>
        {/* <Box>
        commentaires
    </Box> */}
      </Box>
    </Box>

  );
};

export default Post;

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
      profile_picture: PropTypes.string.isRequired,
    }).isRequired,
    image: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
  }).isRequired,
};
