import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { authenticationActions } from '../redux/actions';

function ProfilScreen() {
  const handleLogout = () => {
    authenticationActions.logout();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profil Screen</Text>
      <Button onPress={handleLogout}>
        Déconnexion
      </Button>
    </View>
  );
}

export default ProfilScreen;
