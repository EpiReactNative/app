import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
} from 'react-native';
import {
  Text, Icon, Button, Toast,
  Stack, Spinner, Modal,
} from 'native-base';
import Post from './Post';
import { postActions } from '../redux/actions';
import toasts from '../redux/helpers/toasts';

const PostScreen = ({ route, navigation }) => {
  const { selfuser } = useSelector((state) => state.user);
  const [post] = useState(route.params.post);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const handleOpenDelete = () => setShowDelete(true);
  const handleCloseDelete = () => setShowDelete(false);
  useLayoutEffect(() => {
    const handleDelete = () => {
      setDeleting(true);
      postActions.deletePost({ id: post.id }).then(() => {
        navigation.goBack();
        setDeleting(false);
      }).catch(() => {
        Toast.show(toasts.globalError);
        setDeleting(false);
      });
    };

    if (selfuser && selfuser.id === post.author.id) {
      navigation.setOptions({
        headerRight: () => (
          <Stack>
            {deleting ? (
              <Stack mr="5">
                <Spinner color="#06B6D4" />
              </Stack>
            ) : (
              <Button variant="unstyled" onPress={handleOpenDelete}>
                <Icon as={Ionicons} name="trash-outline" size="28px" color="error.600" />
              </Button>
            )}
            <Modal isOpen={showDelete} onClose={handleCloseDelete}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Suppression</Modal.Header>
                <Modal.Body>
                  <Text>Voulez-vous vraiment supprimer cette publication ?</Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => setShowDelete(false)}
                    >
                      Annuler
                    </Button>
                    <Button colorScheme="danger" onPress={handleDelete}>Confirmer</Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Stack>
        ),
      });
    }
  }, [navigation, deleting, post, showDelete, selfuser]);

  if (!post) return null;

  return (
    <ScrollView>
      <Post targetPost={post} route={route} navigation={navigation} />
    </ScrollView>
  );
};

export default PostScreen;

PostScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      post: PropTypes.shape({}).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    popToTop: PropTypes.func.isRequired,
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
