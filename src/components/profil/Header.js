import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Button, Stack, Text, HStack, VStack, Image,
} from 'native-base';
import config from '../../redux/helpers/config';
import Modal from './UsersModal';

const ProfilHeader = ({ user }) => {
  const { selfuser } = useSelector((state) => state.user);
  const [showFollowers, setShowFollowers] = useState(false);
  const handleOpenFollowers = () => setShowFollowers(true);
  const handleCloseFollowers = () => setShowFollowers(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const handleOpenFollowing = () => setShowFollowing(true);
  const handleCloseFollowing = () => setShowFollowing(false);

  return (
    <Stack w="100%" p="4">
      <HStack w="100%" display="flex" alignItems="center" justifyContent="space-between">
        <Image
          resizeMode="cover"
          source={{ uri: `${config.SERVER_URL}${user.profile_picture}` }}
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
      {selfuser && selfuser.id === user.id ? (
        <Button my="2" py="5px" variant="outline" colorScheme="light" style={{ backgroundColor: 'white' }}>
          <Text semibold>Modifier le profil</Text>
        </Button>
      ) : (
        <Button my="2" py="5px" colorScheme="light" borderColor="dark.500">
          <Text semibold>S&apos;abonner</Text>
        </Button>
      )}
      {showFollowers && (
        <Modal
          user={user}
          show={showFollowers}
          handleClose={handleCloseFollowers}
          name="followers"
          title="Abonnés"
          empty="Aucun abonné"
        />
      )}
      {showFollowing && (
        <Modal
          user={user}
          show={showFollowing}
          handleClose={handleCloseFollowing}
          name="following"
          title="Abonnements"
          empty="Aucun abonnement"
        />
      )}
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
};
