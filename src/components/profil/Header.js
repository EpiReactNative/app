import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Button, Stack, Text, HStack, VStack, Image,
} from 'native-base';
import config from '../../redux/helpers/config';
import { FollowersModal } from './modals';

const ProfilHeader = ({ user }) => {
  const { selfuser } = useSelector((state) => state.user);
  const [showFollowers, setShowFollowers] = useState(false);
  const handleOpenFollowers = () => setShowFollowers(true);
  const handleCloseFollowers = () => setShowFollowers(false);

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
        <Button variant="unstyled" onPress={handleOpenFollowers}>
          <VStack alignItems="center">
            <Text fontSize="md" bold>{user.followers.length}</Text>
            <Text>Abonnés</Text>
          </VStack>
        </Button>
        <VStack alignItems="center">
          <Text fontSize="md" bold>{user.following.length}</Text>
          <Text>Abonnements</Text>
        </VStack>
      </HStack>
      <Text mt="2" semibold>{user.bio}</Text>
      {selfuser.id === user.id ? (
        <Button my="2" py="5px" variant="outline" colorScheme="light" borderColor="dark.500">
          <Text semibold>Modifier le profil</Text>
        </Button>
      ) : (
        <Button my="2" py="5px" variant="outline" colorScheme="light" borderColor="dark.500">
          <Text semibold>Se abonner</Text>
        </Button>
      )}
      {showFollowers && (
        <FollowersModal show={showFollowers} handleClose={handleCloseFollowers} user={user} />
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
