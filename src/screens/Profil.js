import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../components/UserScreen';
import { EditUserScreen } from '../components/profil';

const ProfilStack = createNativeStackNavigator();

function ProfilStackScreen() {
  return (
    <ProfilStack.Navigator>
      <ProfilStack.Screen name="User" component={UserScreen} options={{ title: '' }} initialParams={{ id: -1 }} />
      <ProfilStack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ title: 'Modifier profil' }}
      />
    </ProfilStack.Navigator>
  );
}

export default ProfilStackScreen;
