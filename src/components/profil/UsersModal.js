import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import {
  Button, Toast, Modal, Text, HStack, Image, VStack, Stack, Spinner, ScrollView,
  ZStack, Center, Pressable,
} from 'native-base';
import _ from 'lodash';
import { userActions } from '../../redux/actions';
import toasts from '../../redux/helpers/toasts';
import config from '../../redux/helpers/config';
import Loading from '../Loading';

const UsersModal = ({
  show, handleClose, user, name, title, empty, navigation,
}) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const limit = 8;
  const [offset, setOffset] = useState(0);
  const get = {
    followers: userActions.getFollowers,
    following: userActions.getFollowing,
  };

  const loadMore = _.debounce(() => {
    get[name](user.id, limit, offset).then((data) => {
      if (data.results.length) {
        setItems([...items, ...data.results]);
        setOffset(offset + data.results.length);
      }
      setLoading(false);
    }).catch(() => {
      Toast.show(toasts.globalError);
      setLoading(false);
    });
  }, 500);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      get[name](user.id, limit, 0).then((data) => {
        setItems(data.results);
        setOffset(0 + data.results.length);
        if (isMounted()) setMounted(true);
      }).catch(() => {
        Toast.show(toasts.globalError);
      });
    }
  }, []);

  const renderItem = ({ item, index }) => {
    const getBottomMargin = (i) => {
      if (i !== items.length - 1) return '2';
      return '0';
    };

    const goToUser = () => {
      navigation.push('User', { id: item.id });
    };

    return (
      <HStack px="3" height="39px" mb={getBottomMargin(index)} key={item.id} w="100%" justifyContent="space-between" alignItems="center">
        <Pressable
          onPress={goToUser}
        >
          <HStack alignItems="center">
            <Image
              style={{ overlayColor: 'rgb(249, 250, 251)' }} // handle GIF images rounded
              resizeMode="cover"
              source={{ uri: `${config.SERVER_URL}${item.profile_picture}` }}
              width="30px"
              height="30px"
              alt="Image Profil"
              rounded="full"
            />
            <VStack ml="2">
              <Text semibold fontSize="sm">{item.username}</Text>
              {(item.first_name !== '' || item.last_name !== '') && (
                <Text color="light.500" fontSize="xs">
                  {item.first_name}
                  &nbsp;
                  {item.last_name}
                </Text>
              )}
            </VStack>
          </HStack>
        </Pressable>
        {
          user.following.includes(item.id) ? (
            <Button variant="outline" py="1" px="2" size="sm">Se désabonner</Button>
          ) : (
            <Button py="1" px="2" size="sm">S&apos;abonner</Button>
          )
        }
      </HStack>
    );
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  /* eslint-disable no-nested-ternary */
  return (
    <Modal isOpen={show} onClose={handleClose} size="sm">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body p="0" height="300px">
          {!mounted ? (
            <Center flex={1}>
              <Loading />
            </Center>
          ) : (
            items.length === 0 ? (
              <Center flex={1}>
                <Text semibold color="light.500">{empty}</Text>
              </Center>
            ) : (
              <ScrollView
                data={items}
                renderItem={renderItem}
                onScroll={({ nativeEvent }) => {
                  if (!loading && isCloseToBottom(nativeEvent)) {
                    setLoading(true);
                    loadMore();
                  }
                }}
                scrollEventThrottle={400}
              >
                <Stack pt="2" pb="6">
                  {items.map((item, index) => renderItem({ item, index }))}
                  {loading && (
                    <ZStack mt="2" justifyContent="center" alignItems="center">
                      <Spinner color="#262626" />
                    </ZStack>
                  )}
                </Stack>
              </ScrollView>
            )
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default UsersModal;

UsersModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profile_picture: PropTypes.string.isRequired,
    following: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  empty: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    state: PropTypes.shape({
      key: PropTypes.string.isRequired,
      routeName: PropTypes.string.isRequired,
      path: PropTypes.string,
      params: PropTypes.objectOf(PropTypes.object),
    }),
  }).isRequired,
};
