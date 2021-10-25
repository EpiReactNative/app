import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAsyncEffect } from 'use-async-effect';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';
import _ from 'lodash';
import * as ImagePicker from 'expo-image-picker';
import {
  Button, Stack, Center, NativeBaseProvider, Box, Icon, Text, TextArea, Image,
  Divider, Spinner,
} from 'native-base';
import { uploadConstants } from '../redux/constants';
import { postActions } from '../redux/actions';

function PublicationScreen({ route }) {
  const dispatch = useDispatch();
  // const image = useSelector((state) => state.upload.image);
  const [caption, setCaption] = useState(null);
  const width = Dimensions.get('window').width - 80;
  const height = route.params.image.height / (route.params.image.width / width);

  const handleChange = _.debounce((caption) => {
    console.log(caption);
    dispatch({ type: uploadConstants.UPLOAD_STORE, image: route.params.image, caption });
  }, 250);

  useEffect(() => {
    handleChange('');
  }, [handleChange]);

  return (
    <Stack space={4} w="100%" h="100%" p="10" alignItems="center">
      {route.params.image
        && (
          <Stack>
            <Box w="100%">
              <Text mb="2" bold fontSize="md">Légende</Text>
              <TextArea
                aria-label="t1"
                numberOfLines={4}
                placeholder="Ajouter une légende..."
                _dark={{ placeholderTextColor: 'gray.300' }}
                mb="4"
                onChangeText={handleChange}
              />
              <Divider />
            </Box>
            <Image
              resizeMode="cover"
              source={{ uri: route.params.image.uri }}
              width={width}
              height={height}
              alt="Publication Image"
            />
          </Stack>
        )}
    </Stack>
  );
}

function UploadScreen({ navigation }) {
  const pickImage = async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(image);

    if (!image.cancelled) {
      navigation.navigate('Publication', { image });
    } else {
      console.log('hallo');
      // navigation.navigate('Home');
    }
  };

  useAsyncEffect(async () => {
    if (Platform.OS !== 'web') {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    // pickImage();
  }, []);

  return (
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
  );
}

const UploadStack = createNativeStackNavigator();

const UploadStackScreen = () => {
  const dispatch = useDispatch();
  const { image, caption, isUploading } = useSelector((state) => state.upload);

  const uploadPost = () => {
    console.log(image);
    console.log(caption);
    postActions.uploadPost({ image, caption }).then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    });
  };

  useEffect(() => {
    dispatch({ type: uploadConstants.UPLOAD_CLEAR });
  }, [dispatch]);

  return (
    <NativeBaseProvider>
      <UploadStack.Navigator>
        <UploadStack.Screen name="Upload" component={UploadScreen} options={{ headerShown: false }} />
        <UploadStack.Screen
          name="Publication"
          component={PublicationScreen}
          options={{
            title: 'Nouvelle publication',
            headerRight: () => (
              <Button variant="unstyled" onPress={uploadPost}>
                {isUploading ? (
                  <Spinner style={{ marginRight: '0.5rem' }} color="#06B6D4" />
                ) : (
                  <Icon as={Ionicons} name="checkmark-outline" size="md" color="#06B6D4" />
                )}
              </Button>
            ),
          }}
        />
      </UploadStack.Navigator>
    </NativeBaseProvider>
  );
};

export default UploadStackScreen;
