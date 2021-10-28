import * as React from 'react';
import {
  Button, Center, Text,
} from 'native-base';
import { authenticationActions } from '../redux/actions';

function ProfilScreen() {
  const handleLogout = () => {
    authenticationActions.logout();
  };

  return (
    <Center flex={1} px="10">
      <Text>Profil Screen</Text>
      <Button
        size="lg"
        colorScheme="primary"
        onPress={handleLogout}
      >
        Déconnexion
      </Button>
    </Center>
  );
}

export default ProfilScreen;
