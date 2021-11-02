import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  Toast,
} from 'native-base';

const handleCameraPermissions = async () => {
  if (Platform.OS === 'web') return true; // pas besoin de permissions sur web
  const { accessPrivileges } = ImagePicker.getCameraPermissionsAsync();
  if (accessPrivileges !== 'all') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        title: 'Impossible d\'accéder à la caméra',
        status: 'error',
        placement: 'top',
      });
      return false;
    }
  }
  return true;
};

const handleMediaLibraryPermissions = async () => {
  if (Platform.OS === 'web') return true; // pas besoin de permissions sur web
  const { accessPrivileges } = ImagePicker.getMediaLibraryPermissionsAsync();
  if (accessPrivileges !== 'all') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        title: 'Impossible d\'accéder à vos photos',
        status: 'error',
        placement: 'top',
      });
      return false;
    }
  }
  return true;
};

const ImagePickerTools = {
  handleCameraPermissions,
  handleMediaLibraryPermissions,
};

export default ImagePickerTools;
