import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import {
  Stack, Text, Input, HStack, Icon, Button, VStack, Spinner, Toast,
} from 'native-base';
import config from '../../redux/helpers/config';
import ImagePickerTools from '../../redux/helpers/ImagePicker';
import { userActions } from '../../redux/actions';
import toasts from '../../redux/helpers/toasts';

const EditUserScreen = ({ route, navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputs, setInputs] = useState({
    username: route.params.user.username,
    password: '',
    email: route.params.user.email,
    first_name: route.params.user.first_name,
    last_name: route.params.user.last_name,
    bio: route.params.user.bio,
    profile_picture: { uri: `${config.SERVER_URL}${route.params.user.profile_picture}` },
  });

  const handleClick = () => setShowPassword(!showPassword);

  const imageConfig = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    base64: true,
    quality: 1,
  };

  const saveImage = (image) => {
    if (image.base64) {
      setInputs(() => ({ ...inputs, profile_picture: { uri: `data:image/jpeg;base64,${image.base64}` } }));
    } else {
      setInputs(() => ({ ...inputs, profile_picture: { uri: image.uri } }));
    }
  };

  const selectFromCamera = async () => {
    const isGranted = await ImagePickerTools.handleCameraPermissions();
    if (!isGranted) return;
    const image = await ImagePicker.launchCameraAsync(imageConfig);
    if (!image.cancelled) saveImage(image);
  };

  const selectFromMediaLibrary = async () => {
    const isGranted = await ImagePickerTools.handleMediaLibraryPermissions();
    if (!isGranted) return;
    const image = await ImagePicker.launchImageLibraryAsync(imageConfig);
    if (!image.cancelled) saveImage(image);
  };

  useLayoutEffect(() => {
    const handleValidation = () => {
      if (!inputs.username || inputs.username.length < 4) {
        Toast.show({
          title: 'Nom d\'utilisateur invalide',
          status: 'error',
          placement: 'top',
        });
        return false;
      }
      if (inputs.password.length !== 0 && inputs.password.length < 8) {
        Toast.show({
          title: 'Mot de passe trop court',
          status: 'error',
          placement: 'top',
        });
        return false;
      }
      const lastAtPos = inputs.email.lastIndexOf('@');
      const lastDotPos = inputs.email.lastIndexOf('.');
      if (inputs.email.length !== 0) {
        if (
          !(
            lastAtPos < lastDotPos
            && lastAtPos > 0
            && inputs.email.indexOf('@@') === -1
            && lastDotPos > 2
            && inputs.email.length - lastDotPos > 2
          )
        ) {
          Toast.show({
            title: 'Email invalide',
            status: 'error',
            placement: 'top',
          });
          return false;
        }
      }
      return true;
    };

    const handleSubmit = () => {
      if (!handleValidation()) return;
      setEditing(true);
      console.log(inputs);
      const payload = {
        username: inputs.username,
        password: inputs.password,
        email: inputs.email,
        first_name: inputs.first_name,
        last_name: inputs.last_name,
        bio: inputs.bio,
      };
      if (!inputs.profile_picture.uri.includes('/media/profile_picture/')) {
        payload.profile_picture = inputs.profile_picture.uri;
      }
      userActions.updateUser(route.params.user.id, payload).then((data) => {
        console.log(data);
        setEditing(false);
        navigation.navigate('User');
      }).catch(() => {
        Toast.show(toasts.globalError);
        setEditing(false);
      });
    };

    navigation.setOptions({
      headerRight: () => (
        <Stack>
          {editing ? (
            <Stack mr="5">
              <Spinner color="#06B6D4" />
            </Stack>
          ) : (
            <Button variant="unstyled" onPress={handleSubmit}>
              <Icon as={Ionicons} name="checkmark-outline" size="md" color="#06B6D4" />
            </Button>
          )}
        </Stack>
      ),
    });
  }, [navigation, editing, inputs, route]);

  return (
    <Stack p="4" w="100%" h="100%">
      <HStack mb="6" w="100%" alignItems="center" justifyContent="space-around">
        <Button variant="outline" colorScheme="light" onPress={selectFromMediaLibrary} style={{ backgroundColor: 'white' }}>
          <Icon as={Ionicons} name="image-outline" size="lg" color="#262626" />
        </Button>
        <VStack alignItems="center">
          <Image
            resizeMode="cover"
            style={{
              width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#d6d3d1',
            }}
            source={inputs.profile_picture}
            alt="Image Profil"
          />
          <Text mt="2" fontSize="sm">Changer la photo de profil</Text>
        </VStack>
        <Button variant="outline" colorScheme="light" onPress={selectFromCamera} style={{ backgroundColor: 'white' }}>
          <Icon as={Ionicons} name="camera-outline" size="lg" color="#262626" />
        </Button>
      </HStack>
      <Text color="light.500" fontSize="xs">Nom d&apos;utilisateur</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Nom d'utilisateur"
        value={inputs.username}
        onChangeText={(value) => setInputs(() => ({ ...inputs, username: value }))}
      />
      <Text color="light.500" fontSize="xs">Email</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Email"
        type="email"
        value={inputs.email}
        onChangeText={(value) => setInputs(() => ({ ...inputs, email: value }))}
      />
      <Text color="light.500" fontSize="xs">Mot de passe</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        InputRightElement={(
          <Button
            variant="unstyled"
            onPress={handleClick}
          >
            <Icon
              as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />}
              size={5}
              mr="2"
              color="muted.400"
            />
          </Button>
        )}
        value={inputs.password}
        onChangeText={(value) => setInputs(() => ({ ...inputs, password: value }))}
      />
      <Text color="light.500" fontSize="xs">Nom</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Nom"
        value={inputs.last_name}
        onChangeText={(value) => setInputs(() => ({ ...inputs, last_name: value }))}
      />
      <Text color="light.500" fontSize="xs">Prénom</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Prénom"
        value={inputs.first_name}
        onChangeText={(value) => setInputs(() => ({ ...inputs, first_name: value }))}
      />
      <Text color="light.500" fontSize="xs">Bio</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Bio"
        value={inputs.bio}
        onChangeText={(value) => setInputs(() => ({ ...inputs, bio: value }))}
      />
    </Stack>
  );
};

export default EditUserScreen;

EditUserScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        profile_picture: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
    state: PropTypes.shape({
      key: PropTypes.string.isRequired,
      routeName: PropTypes.string.isRequired,
      path: PropTypes.string,
      params: PropTypes.objectOf(PropTypes.object),
    }),
  }).isRequired,
};
