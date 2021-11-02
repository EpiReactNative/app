import React, { useState } from 'react';
import Constants from 'expo-constants';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Button, Stack, Text, HStack, Icon, Modal, Divider,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { authenticationActions } from '../../redux/actions';

const ProfilTopBar = ({ user }) => {
  const { selfuser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    authenticationActions.logout();
    setShowModal(false);
  };

  return (
    <Stack
      w="100%"
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'white',
      }}
    >
      <Stack w="100%" px="4" py="3">
        <HStack w="100%" justifyContent="space-between" alignItems="center">
          <Text bold fontSize="xl">{user.username}</Text>
          {selfuser.id === user.id && (
            <Button p="0" variant="unstyled" onPress={() => setShowModal(true)}>
              <Icon as={Ionicons} name="log-out-outline" size="28px" color="#262626" />
            </Button>
          )}
        </HStack>
      </Stack>
      <Divider bg="light.200" w="100%" />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Déconnexion</Modal.Header>
          <Modal.Body>
            <Text>Voulez-vous vraiment vous déconnecter ?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => setShowModal(false)}
              >
                Annuler
              </Button>
              <Button colorScheme="danger" onPress={handleLogout}>Confirmer</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Stack>
  );
};

export default ProfilTopBar;

ProfilTopBar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};
