import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import PropTypes from 'prop-types';
/* eslint-disable camelcase */
import { useFonts, LeckerliOne_400Regular } from '@expo-google-fonts/leckerli-one';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, useToast, Stack, Center, NativeBaseProvider, Input, Icon, Text,
} from 'native-base';
import { authenticationActions } from '../redux/actions';
import { authenticationConstants } from '../redux/constants';

function LoginScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const isLoggingIn = useSelector((state) => state.authentication.isLoggingIn);
  const toast = useToast();
  const [inputs, setInputs] = useState({
    username: 'admin',
    password: 'admin',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fontsLoaded] = useFonts({
    LeckerliOne_400Regular,
  });

  useEffect(() => {
    if (route.params && route.params.registerSuccess) {
      toast.show({
        title: 'Inscription réussie',
        status: 'success',
        placement: 'top',
      });
    }
  }, [route.params]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => setShowPassword(!showPassword);

  const handleSubmit = () => {
    authenticationActions.login(inputs.username, inputs.password)
      .then(() => {
      })
      .catch(() => {
        dispatch({ type: authenticationConstants.LOGIN_FAILURE });
        toast.show({
          title: 'Impossible de se connecter',
          status: 'error',
          placement: 'top',
        });
      });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <Stack space={4} w="100%" alignItems="center">
      <Text
        fontSize="4xl"
        style={{ fontFamily: 'LeckerliOne_400Regular' }}
      >
        Epigram
      </Text>
      <Input
        size="lg"
        w="100%"
        InputLeftElement={(
          <Icon
            as={<MaterialIcons name="person" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        )}
        placeholder="Nom d'utilisateur"
        onChangeText={(value) => setInputs(() => ({ ...inputs, username: value }))}
      />
      <Input
        size="lg"
        w="100%"
        type={showPassword ? 'text' : 'password'}
        InputRightElement={(
          <Button
            variant="unstyled"
            onPress={handleClick}
          >
            <Icon
              as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />}
              size={5}
              mr="2"
              color="muted.400"
            />
          </Button>
        )}
        placeholder="Mot de passe"
        onChangeText={(value) => setInputs(() => ({ ...inputs, password: value }))}
      />
      <Button w="100%" size="lg" isLoading={isLoggingIn} colorScheme="primary" onPress={handleSubmit} isDisabled={!inputs.username || !inputs.password}>
        Connexion
      </Button>
      <Stack direction="row" alignItems="center">
        <Text>
          Vous n&apos;avez pas de compte ?
        </Text>
        <Button
          variant="unstyled"
          onPress={() => navigation.navigate('Register')}
        >
          <Text bold>Inscrivez-vous</Text>
        </Button>
      </Stack>
    </Stack>
  );
}

const Provider = ({ route, navigation }) => (
  <NativeBaseProvider>
    <Center flex={1} px="10">
      <LoginScreen route={route} navigation={navigation} />
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

LoginScreen.propTypes = {
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
