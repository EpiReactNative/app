import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Stack, Toast, Icon, Button, Spinner,
} from 'native-base';
import { userActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import {
  ProfilTopBar, ProfilHeader, ProfilContainer, EditUserScreen,
} from '../components/profil';

const UserScreen = ({ route, navigation }) => {
  console.log(route.params.user);
  return (
    <Stack w="100%" h="100%">
      <ProfilTopBar user={route.params.user} />
      <ProfilHeader user={route.params.user} navigation={navigation} />
      <ProfilContainer user={route.params.user} />
    </Stack>
  );
};

const ProfilStack = createNativeStackNavigator();

function ProfilStackScreen({ id }) {
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(undefined);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      userActions.whoami().then((selfuser) => {
        if (id && selfuser && id !== selfuser.id) {
          userActions.getUser(id).then((data) => {
            setUser(data);
            if (isMounted()) setMounted(true);
          }).catch(() => {
            Toast.show(toasts.globalError);
          });
        } else {
          setUser(selfuser);
          if (isMounted()) setMounted(true);
        }
      }).catch(() => {
        Toast.show(toasts.globalError);
      });
    }
  }, []);

  const editUser = () => {
    console.log('edit user');
    setEditing(false);
  };

  if (!mounted || !user) {
    return <Loading />;
  }

  return (
    <ProfilStack.Navigator>
      <ProfilStack.Screen name="User" component={UserScreen} options={{ headerShown: false }} initialParams={{ user }} />
      <ProfilStack.Screen
        name="EditUser"
        component={EditUserScreen}
        initialParams={{ user }}
        options={{
          title: 'Modifier profil',
          headerRight: () => (
            <Stack>
              {editing ? (
                <Stack mr="5">
                  <Spinner color="#06B6D4" />
                </Stack>
              ) : (
                <Button variant="unstyled" onPress={editUser}>
                  <Icon as={Ionicons} name="checkmark-outline" size="md" color="#06B6D4" />
                </Button>
              )}
            </Stack>
          ),
        }}
      />
    </ProfilStack.Navigator>
  );
}

export default ProfilStackScreen;

ProfilStackScreen.propTypes = {
  id: PropTypes.number,
};

ProfilStackScreen.defaultProps = {
  id: null,
};

UserScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({}).isRequired,
    }).isRequired,
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
