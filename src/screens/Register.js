import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Stack, Center, Input, Icon, Text, Toast,
} from 'native-base';
/* eslint-disable camelcase */
import { useFonts, LeckerliOne_400Regular } from '@expo-google-fonts/leckerli-one';
import { MaterialIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { authenticationActions } from '../redux/actions';

function RegisterScreen({ navigation }) {
  const [inputs, setInputs] = useState({
    username: 'test',
    email: 'test@test.com',
    password: 'test',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [fontsLoaded] = useFonts({ LeckerliOne_400Regular });

  const handleClick = () => setShowPassword(!showPassword);

  const handleValidation = () => {
    const lastAtPos = inputs.email.lastIndexOf('@');
    const lastDotPos = inputs.email.lastIndexOf('.');
    if (
      !(
        lastAtPos < lastDotPos
        && lastAtPos > 0
        && inputs.email.indexOf('@@') === -1
        && lastDotPos > 2
        && inputs.email.length - lastDotPos > 2
      )
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!handleValidation()) return;
    setisLoading(true);
    authenticationActions.register(inputs.username, inputs.email, inputs.password)
      .then(() => {
        navigation.navigate('Login', { registerSuccess: true });
      })
      .catch(() => {
        setisLoading(false);
        Toast.show({
          title: 'Une erreur est survenue',
          status: 'error',
          placement: 'top',
        });
      });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <Center flex={1} px="10">
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
          value={inputs.username}
          onChangeText={(value) => setInputs(() => ({ ...inputs, username: value }))}
        />
        <Input
          size="lg"
          w="100%"
          InputLeftElement={(
            <Icon
              as={<MaterialIcons name="mail" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          )}
          placeholder="Adresse mail"
          value={inputs.email}
          onChangeText={(value) => setInputs(() => ({ ...inputs, email: value }))}
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
          value={inputs.password}
          onChangeText={(value) => setInputs(() => ({ ...inputs, password: value }))}
        />
        <Button
          w="100%"
          size="lg"
          isLoading={isLoading}
          colorScheme="primary"
          onPress={handleSubmit}
          isDisabled={!inputs.username || !inputs.password || !inputs.email}
        >
          Inscription
        </Button>
        <Stack direction="row" alignItems="center">
          <Text>
            Déjà un compte ?
          </Text>
          <Button
            variant="unstyled"
            disabled={isLoading}
            onPress={() => navigation.navigate('Login')}
          >
            <Text bold>Connectez-vous</Text>
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}

export default RegisterScreen;

RegisterScreen.propTypes = {
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
