import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  Button, Stack, Center, NativeBaseProvider, Icon,
} from 'native-base';
import { uploadConstants } from '../../redux/constants';

function UploadScreen({ navigation }) {
  const dispatch = useDispatch();

  const pickImage = async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsMultipleSelection: true, // est-ce qu'on veut vraiment faire ça ?
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!image.cancelled) {
      navigation.navigate('Publication', { image });
    }
  };

  useEffect(() => {
    dispatch({ type: uploadConstants.UPLOAD_CLEAR });
  }, [dispatch]);

  useAsyncEffect(async () => {
    if (Platform.OS !== 'web') {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    // pickImage(); // ouvrir la sélection d'image dès que le user accède à l'onglet ??
  }, []);

  return (
    <NativeBaseProvider>
      <Center flex={1} px="10">
        <Stack space={4} w="100%" alignItems="center">
          <Button
            onPress={pickImage}
            variant="unstyled"
          >
            <Icon as={Ionicons} name="cloud-upload-outline" size="5xl" color="#06B6D4" />
          </Button>
          <Button onPress={pickImage}>
            Sélectionner des photos
          </Button>
        </Stack>
      </Center>
    </NativeBaseProvider>
  );
}

export default UploadScreen;

UploadScreen.propTypes = {
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
