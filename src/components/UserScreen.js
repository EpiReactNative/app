import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  Toast, Stack, Button, Icon, Modal, Text,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { userActions, authenticationActions } from '../redux/actions';
import Loading from './Loading';
import toasts from '../redux/helpers/toasts';
import { ProfilHeader, ProfilContainer } from './profil';

const UserScreen = ({ route, navigation }) => {
  const [mounted, setMounted] = useState(false);
  const { selfuser } = useSelector((state) => state.user);
  const [user, setUser] = useState(undefined);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    const id = route.params.id === -1 ? null : route.params.id;
    userActions.whoami().then((selfUserData) => {
      if (id && selfUserData && id !== selfUserData.id) {
        userActions.getUser(id).then((data) => {
          setUser(data);
          setMounted(true);
        }).catch(() => {
          Toast.show(toasts.globalError);
        });
      } else {
        setUser(selfUserData);
        setMounted(true);
      }
    }).catch(() => {
      Toast.show(toasts.globalError);
    });
  };

  useEffect(() => {
    async function myAsyncEffect() {
      await fetchData();
    }

    if (isFocused) {
      // On recharge la page uniquement si on pointe vers l'utilisateur connecté
      if (selfuser && user && selfuser.id !== user.id) {
        setMounted(true);
      } else {
        myAsyncEffect();
      }
    }

    return () => {
      setMounted(false);
    };
    // Comment éviter le boucle inf si on ajoute fetchData() dans les dépendances du useEffect ?
  }, [isFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  const follow = () => {
    userActions.follow(user.id).then(() => {
      fetchData();
    }).catch(() => {
      Toast.show(toasts.globalError);
    });
  };

  const [showModal, setShowModal] = useState(false);
  useLayoutEffect(() => {
    if (mounted && user) {
      const handleLogout = () => {
        authenticationActions.logout();
        setShowModal(false);
      };
      navigation.setOptions({
        title: user.username,
        headerRight: () => (
          selfuser && user && selfuser.id === user.id && (
            <Button mr="3" p="0" variant="unstyled" onPress={() => setShowModal(true)}>
              <Icon as={Ionicons} name="log-out-outline" size="28px" color="#262626" />
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
            </Button>
          )
        ),
      });
    }
  }, [navigation, user, mounted, selfuser, showModal]);

  if (!mounted || !user) {
    return <Loading />;
  }

  return (
    <Stack w="100%" h="100%">
      <ProfilHeader user={user} follow={follow} fetchData={fetchData} navigation={navigation} />
      <ProfilContainer user={user} navigation={navigation} />
    </Stack>
  );
};

export default UserScreen;

UserScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
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
