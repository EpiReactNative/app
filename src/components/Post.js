import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Moment from 'moment';
import 'moment/locale/fr';
import {
  Dimensions,
} from 'react-native';
import {
  Text, VStack, HStack, Image, Icon, Button, Pressable, Toast, PresenceTransition,
} from 'native-base';
import Loading from './Loading';
import { postActions } from '../redux/actions';
import toasts from '../redux/helpers/toasts';
import UserModal from './profil/Modal';

const Post = ({ navigation, targetPost }) => {
  const { selfuser } = useSelector((state) => state.user);
  const [post, setPost] = useState(targetPost);
  const [showLikers, setShowLikers] = useState(false);
  const handleOpenLikers = () => setShowLikers(true);
  const handleCloseLikers = () => setShowLikers(false);
  const goToUser = () => {
    navigation.push('User', { id: post.author.id });
  };

  const handleLike = () => {
    postActions.likePost({ id: post.id }).then((data) => {
      setPost(data);
    }).catch(() => {
      Toast.show(toasts.globalError);
    });
  };

  if (!post) {
    return <Loading />;
  }

  return (
    <VStack my="2" key={post.id} width="100%">
      <HStack p="3" display="flex" alignItems="center">
        <Pressable onPress={goToUser}>
          <Image
            style={{ overlayColor: 'rgb(242, 242, 242)' }} // handle GIF images rounded
            resizeMode="cover"
            source={{ uri: post.author.profile_picture }}
            width="40px"
            height="40px"
            alt="Profil Picture"
            rounded="full"
          />
        </Pressable>
        <Pressable onPress={goToUser}>
          <Text ml="3" bold fontSize="md">{post.author.username}</Text>
        </Pressable>
      </HStack>
      <Image
        source={{ uri: post.image }}
        alt="Post"
        width={Dimensions.get('window').width}
        height={post.height * (Dimensions.get('window').width / post.width)}
      />
      <HStack p="2" justifyContent="flex-start">
        <Button p="0" variant="unstyled" onPress={handleLike}>
          {selfuser && post.likes.includes(selfuser.id) ? (
            <PresenceTransition
              visible={post.likes.includes(selfuser.id)}
              initial={{
                opacity: 0,
                scale: 1.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 250,
                },
              }}
            >
              <Icon as={Ionicons} name="heart" size="md" color="#ED4956" />
            </PresenceTransition>
          ) : (
            <Icon as={Ionicons} name="heart-outline" size="md" color="#262626" />
          )}
        </Button>
        {/* <Icon ml="2" as={Ionicons} name="chatbubble-outline" size="md" color="#262626" /> */}
      </HStack>
      <VStack space={1} px="3" pb="2" width="100%">
        <Pressable onPress={handleOpenLikers}>
          {post.likes.length > 0 && <Text bold>{`${post.likes.length} J'aime`}</Text>}
        </Pressable>
        {post.caption !== '' && (
          <HStack display="flex" alignItems="center">
            <Text bold>{post.author.username}</Text>
            <Text ml="2">{post.caption}</Text>
          </HStack>
        )}
        {/* <Pressable>
          <Text fontWeight="light">Voir les X commentaires</Text>
        </Pressable> */}
        <Text fontWeight="light" fontSize="xs">{Moment(post.created_at).locale('fr').format('LL')}</Text>
      </VStack>
      {
        showLikers && (
          <UserModal
            navigation={navigation}
            id={post.id}
            show={showLikers}
            handleClose={handleCloseLikers}
            name="likes"
            title="Mentions J'aime"
            empty="Aucun J'aime"
          />
        )
      }
    </VStack>
  );
};

export default Post;

Post.propTypes = {
  targetPost: PropTypes.shape({}).isRequired,
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
