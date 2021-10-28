import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
  Button, Stack, Icon, Spinner, useToast,
} from 'native-base';
import { postActions } from '../redux/actions';
import { FileScreen, PublicationScreen } from '../components/upload';

const UploadStack = createNativeStackNavigator();

const UploadStackScreen = ({ navigation }) => {
  const toast = useToast();
  // const isUploading = false;
  const { image, caption, isUploading } = useSelector((state) => state.upload);

  const uploadPost = () => {
    postActions.uploadPost({ image, caption }).then(() => {
      navigation.popToTop();
      navigation.navigate('Home');
    }).catch(() => {
      toast.show({
        title: 'Une erreur est survenue',
        status: 'error',
        placement: 'top',
      });
    });
  };

  return (
    <UploadStack.Navigator>
      <UploadStack.Screen name="File" component={FileScreen} options={{ headerShown: false }} />
      <UploadStack.Screen
        name="Publication"
        component={PublicationScreen}
        options={{
          title: 'Nouvelle publication',
          headerRight: () => (
            <Stack>
              {isUploading ? (
                <Stack mr="5">
                  <Spinner color="#06B6D4" />
                </Stack>
              ) : (
                <Button variant="unstyled" onPress={uploadPost}>
                  <Icon as={Ionicons} name="checkmark-outline" size="md" color="#06B6D4" />
                </Button>
              )}
            </Stack>
          ),
        }}
      />
    </UploadStack.Navigator>
  );
};

export default UploadStackScreen;

UploadStackScreen.propTypes = {
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    popToTop: PropTypes.func.isRequired,
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
