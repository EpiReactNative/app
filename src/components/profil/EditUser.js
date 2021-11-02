import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import {
  Stack, Text, Input, HStack, Icon, Button, VStack,
} from 'native-base';
import config from '../../redux/helpers/config';
import ImagePickerTools from '../../redux/helpers/ImagePicker';

const EditUserScreen = ({ route }) => {
  console.log(route.params.user);
  const [inputs, setInputs] = useState({
    username: route.params.user.username,
    first_name: route.params.user.first_name,
    last_name: route.params.user.last_name,
    profile_picture: { uri: `${config.SERVER_URL}${route.params.user.profile_picture}` },
  });

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
    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      square: [1, 1],
      base64: true,
      quality: 1,
    });
    if (!image.cancelled) saveImage(image);
  };

  const selectFromMediaLibrary = async () => {
    const isGranted = await ImagePickerTools.handleMediaLibraryPermissions();
    if (!isGranted) return;
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      square: [1, 1],
      quality: 1,
    });
    if (!image.cancelled) saveImage(image);
  };

  return (
    <Stack p="4" w="100%" h="100%">
      <HStack mb="6" w="100%" alignItems="center" justifyContent="space-around">
        <Button variant="outline" colorScheme="light" onPress={selectFromMediaLibrary} style={{ backgroundColor: 'white' }}>
          <Icon as={Ionicons} name="image-outline" size="lg" color="#262626" />
        </Button>
        <VStack alignItems="center">
          <Image
            mb="2"
            resizeMode="cover"
            source={inputs.profile_picture}
            width="100px"
            height="100px"
            alt="Image Profil"
            rounded="full"
          />
          <Text semibold fontSize="md">Changer la photo de profil</Text>
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
      <Text color="light.500" fontSize="xs">Prénom</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Prénom"
        value={inputs.first_name}
        onChangeText={(value) => setInputs(() => ({ ...inputs, first_name: value }))}
      />
      <Text color="light.500" fontSize="xs">Nom</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Nom"
        value={inputs.first_name}
        onChangeText={(value) => setInputs(() => ({ ...inputs, last_name: value }))}
      />
      <Text color="light.500" fontSize="xs">Bio</Text>
      <Input
        mb="4"
        size="md"
        variant="underlined"
        placeholder="Bio"
        value={inputs.first_name}
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
        username: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        profile_picture: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
