import AsyncStorage from '@react-native-async-storage/async-storage';

const setStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const getStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
      // value previously stored
    }
  } catch (e) {
    // error reading value
  }
  return null;
};

const removeStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};

const asyncStorageMethods = {
  setStorage,
  getStorage,
  removeStorage,
};

export default asyncStorageMethods;
