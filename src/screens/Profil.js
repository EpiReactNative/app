import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../components/UserScreen';
import PostScreen from '../components/PostScreen';
import { EditUserScreen } from '../components/profil';

const ProfilStack = createNativeStackNavigator();

function ProfilStackScreen() {
  return (
    <ProfilStack.Navigator>
      <ProfilStack.Screen name="User" component={UserScreen} options={{ title: '' }} initialParams={{ id: -1 }} />
      <ProfilStack.Screen name="Post" component={PostScreen} options={{ title: 'Publications' }} />
      <ProfilStack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ title: 'Modifier profil' }}
      />
    </ProfilStack.Navigator>
  );
}

export default ProfilStackScreen;
