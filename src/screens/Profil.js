import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import {
  Stack, Toast,
} from 'native-base';
import { userActions } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import {
  ProfilTopBar, ProfilHeader, ProfilContainer, EditUserScreen,
} from '../components/profil';

const UserScreen = ({ route, navigation }) => (
  <Stack w="100%" h="100%">
    <ProfilTopBar user={route.params.user} />
    <ProfilHeader user={route.params.user} navigation={navigation} />
    <ProfilContainer user={route.params.user} />
  </Stack>
);

const ProfilStack = createNativeStackNavigator();

function ProfilStackScreen({ id }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(undefined);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    setMounted(false);
    if (!mounted) setMounted(false);
    userActions.whoami().then((selfuser) => {
      if (id && selfuser && id !== selfuser.id) {
        userActions.getUser(id).then((data) => {
          setUser(data);
          setMounted(true);
        }).catch(() => {
          Toast.show(toasts.globalError);
        });
      } else {
        setUser(selfuser);
        setMounted(true);
      }
    }).catch(() => {
      Toast.show(toasts.globalError);
    });
  };

  useEffect(() => {
    async function myAsyncEffect() {
      await fetchData();
    }

    if (isFocused) {
      myAsyncEffect();
    }

    return () => {
      setMounted(false);
    };
    // Comment éviter le boucle inf si on ajoute fetchData() dans les dépendances du useEffect ?
  }, [isFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || !user) {
    return <Loading />;
  }

  return (
    <ProfilStack.Navigator>
      <ProfilStack.Screen name="User" component={UserScreen} options={{ headerShown: false }} initialParams={{ user }} />
      <ProfilStack.Screen
        name="EditUser"
        component={EditUserScreen}
        initialParams={{ user, fetchData }}
        options={{
          title: 'Modifier profil',
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
