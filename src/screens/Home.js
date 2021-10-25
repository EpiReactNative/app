import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Stack, Center, NativeBaseProvider, Text,
} from 'native-base';
import { authenticationActions } from '../redux/actions';

function HomeScreen() {
  const handleLogout = () => {
    authenticationActions.logout();
  };

  return (
    <Stack space={4} w="100%" alignItems="center">
      <Text>Home Screen</Text>
      <Button onPress={handleLogout}>
        Déconnexion
      </Button>
    </Stack>
  );
}

const Provider = ({ route, navigation }) => (
  <NativeBaseProvider>
    <Center flex={1} px="10">
      <HomeScreen route={route} navigation={navigation} />
    </Center>
  </NativeBaseProvider>
);

export default Provider;

Provider.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.objectOf(PropTypes.object),
    }),
  }).isRequired,
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

HomeScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      registerSuccess: PropTypes.bool,
    }),
  }).isRequired,
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
