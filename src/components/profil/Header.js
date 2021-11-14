import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Button, Stack, Text, HStack, VStack, Image, Spinner,
} from 'native-base';
import Modal from './Modal';

const ProfilHeader = ({
  navigation, user, follow, fetchData,
}) => {
  const { selfuser } = useSelector((state) => state.user);
  const [showFollowers, setShowFollowers] = useState(false);
  const handleOpenFollowers = () => setShowFollowers(true);
  const handleCloseFollowers = () => {
    setShowFollowers(false);
    fetchData();
  };
  const [showFollowing, setShowFollowing] = useState(false);
  const handleOpenFollowing = () => setShowFollowing(true);
  const handleCloseFollowing = () => {
    setShowFollowing(false);
    fetchData();
  };

  const editUser = () => {
    navigation.navigate('EditUser', { user });
  };

  return (
    <Stack w="100%" p="4">
      <HStack w="100%" display="flex" alignItems="center" justifyContent="space-between">
        <Image
          style={{ overlayColor: 'rgb(242, 242, 242)' }} // handle GIF images rounded
          resizeMode="cover"
          source={{ uri: `${user.profile_picture}` }}
          width="90px"
          height="90px"
          alt="Image Profil"
          rounded="full"
        />
        <VStack alignItems="center">
          <Text fontSize="md" bold>{user.posts.length}</Text>
          <Text>Publications</Text>
        </VStack>
        <Button p="0" variant="unstyled" onPress={handleOpenFollowers}>
          <VStack alignItems="center">
            <Text fontSize="md" bold>{user.followers.length}</Text>
            <Text>Abonnés</Text>
          </VStack>
        </Button>
        <Button p="0" variant="unstyled" onPress={handleOpenFollowing}>
          <VStack alignItems="center">
            <Text fontSize="md" bold>{user.following.length}</Text>
            <Text>Abonnements</Text>
          </VStack>
        </Button>
      </HStack>
      <Text mt="2" semibold>{user.bio}</Text>
      {/* eslint-disable-next-line no-nested-ternary */}
      {selfuser && user ? (
        selfuser.id === user.id ? (
          <Button
            my="2"
            py="5px"
            variant="outline"
            colorScheme="light"
            style={{ backgroundColor: 'white' }}
            onPress={editUser}
          >
            <Text semibold>Modifier le profil</Text>
          </Button>
        ) : (
          <Button variant={selfuser && selfuser.following.includes(user.id) ? 'subtle' : 'solid'} my="2" py="5px" onPress={follow}>
            {selfuser && selfuser.following.includes(user.id) ? (
              <Text bold color="cyan.500">Se désabonner</Text>
            ) : (
              <Text bold color="rgb(242, 242, 242)">S&apos;abonner</Text>
            )}
          </Button>
        )
      ) : (
        <Stack my="2" p="1.5">
          <Spinner color="#06B6D4" />
        </Stack>
      )}
      {
        showFollowers && (
          <Modal
            navigation={navigation}
            id={user.id}
            show={showFollowers}
            handleClose={handleCloseFollowers}
            name="followers"
            title="Abonnés"
            empty="Aucun abonné"
          />
        )
      }
      {
        showFollowing && (
          <Modal
            navigation={navigation}
            id={user.id}
            show={showFollowing}
            handleClose={handleCloseFollowing}
            name="following"
            title="Abonnements"
            empty="Aucun abonnement"
          />
        )
      }
    </Stack>
  );
};

export default ProfilHeader;

ProfilHeader.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profile_picture: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf(PropTypes.number).isRequired,
    followers: PropTypes.arrayOf(PropTypes.number).isRequired,
    following: PropTypes.arrayOf(PropTypes.number).isRequired,
    bio: PropTypes.string.isRequired,
  }).isRequired,
  follow: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
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
