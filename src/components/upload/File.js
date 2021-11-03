import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  Button, Stack, Center, Icon, Text, HStack, Divider, VStack,
} from 'native-base';
import { uploadConstants } from '../../redux/constants';
import ImagePickerTools from '../../redux/helpers/ImagePicker';

const FileScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const imageConfig = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    // allowsMultipleSelection: true, // est-ce qu'on veut vraiment faire ça ?
    allowsEditing: true,
    base64: true,
    quality: 1,
  };

  const selectFromCamera = async () => {
    const isGranted = await ImagePickerTools.handleCameraPermissions();
    if (!isGranted) return;
    const image = await ImagePicker.launchCameraAsync(imageConfig);
    if (!image.cancelled) {
      navigation.navigate('Publication', { image });
    }
  };

  const selectFromMediaLibrary = async () => {
    const isGranted = await ImagePickerTools.handleMediaLibraryPermissions();
    if (!isGranted) return;
    const image = await ImagePicker.launchImageLibraryAsync(imageConfig);
    if (!image.cancelled) {
      navigation.navigate('Publication', { image });
    }
  };

  useEffect(() => {
    dispatch({ type: uploadConstants.UPLOAD_CLEAR });
  }, [dispatch]);

  return (
    <Center flex={1} px="10">
      <Stack space={4} w="100%" alignItems="center">
        <Icon as={Ionicons} name="cloud-upload-outline" size="5xl" color="#262626" />
        <Stack my="4" w="100%" alignItems="center">
          <Text>Pour créer une publication</Text>
          <Text fontSize="2xl" bold>Ajouter des photos</Text>
        </Stack>
        <Button
          my="4"
          px="6"
          onPress={selectFromCamera}
          leftIcon={<Icon as={Ionicons} size="md" name="camera-outline" />}
          borderRadius="full"
        >
          <Text fontSize="md" color="white">Appareil photo</Text>
        </Button>
        <HStack w="75%" justifyContent="space-between" alignItems="center">
          <Divider bg="light.400" w="40%" />
          <Text color="light.500" semibold>OU</Text>
          <Divider bg="light.400" w="40%" />
        </HStack>
        <Button my="4" variant="outline" colorScheme="light" onPress={selectFromMediaLibrary} style={{ backgroundColor: 'white' }}>
          <HStack justifyContent="space-between" alignItems="center">
            <Icon as={Ionicons} name="image-outline" size="lg" color="#262626" />
            <VStack ml="2" justify="flex-start" align="center">
              <Text color="#262626" semibold>Sélectionner depuis la Gallerie</Text>
              <Text color="light.500" fontSize="xs">PNG, JPEG et GIF</Text>
            </VStack>
          </HStack>
        </Button>
      </Stack>
    </Center>
  );
};

export default FileScreen;

FileScreen.propTypes = {
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
