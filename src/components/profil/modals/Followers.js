import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  SafeAreaView, ScrollView,
} from 'react-native';
import {
  Button, Toast, Modal, Text, HStack, Image, VStack,
} from 'native-base';
import { userActions } from '../../../redux/actions';
import toasts from '../../../redux/helpers/toasts';
import config from '../../../redux/helpers/config';

const FollowersModal = ({ show, handleClose, user }) => {
  const [mounted, setMounted] = useState(false);
  const [followers, setFollowers] = useState(undefined);
  const limit = 7;
  const [offset, setOffset] = useState(0);

  const loadMore = () => {
    console.log('test');
  };

  useAsyncEffect(async (isMounted) => {
    console.log(user);
    if (isMounted()) {
      userActions.getFollowers(user.id, limit, offset).then((data) => {
        setFollowers(data.results);
        setOffset(offset + limit);
        if (isMounted()) setMounted(true);
      }).catch(() => {
        Toast.show(toasts.globalError);
      });
    }
  }, []);

  if (!mounted) return null;

  return (
    <Modal isOpen={show} onClose={handleClose} size="sm">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Abonnés</Modal.Header>
        <Modal.Body height="240px">
          <SafeAreaView>
            <ScrollView onEndReached={loadMore}>
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <HStack mb="3" key={follower.id} w="100%" justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center">
                      <Image
                        resizeMode="cover"
                        source={{ uri: `${config.SERVER_URL}${follower.profile_picture}` }}
                        width="30px"
                        height="30px"
                        alt="Image Profil"
                        rounded="full"
                      />
                      <VStack ml="2" alignItems="center">
                        <Text bold>{follower.username}</Text>
                        {(follower.first_name || follower.last_name) && (
                          <Text>
                            {follower.first_name}
                            &nbsp;
                            {follower.last_name}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                    {user.following.includes(follower.id) ? (
                      <Button variant="outline" py="1" px="2" size="sm">Se désabonner</Button>
                    ) : (
                      <Button py="1" px="2" size="sm">S&apos;abonner</Button>
                    )}
                  </HStack>
                ))
              ) : (
                <Text semibold>Aucun abonné</Text>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default FollowersModal;

FollowersModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profile_picture: PropTypes.string.isRequired,
    following: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
