import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
/* eslint-disable camelcase */
import { useFonts, LeckerliOne_400Regular } from '@expo-google-fonts/leckerli-one';
import { useNavigation } from '@react-navigation/native';
import {
  Button, Stack, Center, NativeBaseProvider, Input, Icon, Text, Collapse, VStack, HStack, Alert,
  CloseIcon, IconButton,
} from 'native-base';
import authenticationActions from '../redux/actions/authentication';

function RegisterScreen() {
  const [inputs, setInputs] = useState({
    username: 'test',
    email: 'test@test.com',
    password: 'test',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    LeckerliOne_400Regular,
  });

  const handleClick = () => setShowPassword(!showPassword);

  const handleValidation = () => {
    setError('');
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
      setError('Email incorrect.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!handleValidation()) return;
    setError('false');
    setisLoading(true);
    authenticationActions.register(inputs.username, inputs.email, inputs.password)
      .then(() => {
      })
      .catch(() => {
        setError('Une erreur est survenue');
        setisLoading(false);
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
      <Collapse isOpen={error}>
        <Alert w="100%" status="error">
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: 'coolGray.800',
                  }}
                >
                  {error}
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                icon={<CloseIcon size="3" color="coolGray.600" />}
                onPress={() => setError(false)}
              />
            </HStack>
          </VStack>
        </Alert>
      </Collapse>
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
        InputLeftElement={(
          <Icon
            as={<MaterialIcons name="mail" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        )}
        placeholder="Adresse mail"
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
          onPress={() => navigation.navigate('Login')}
        >
          <Text bold>Connectez-vous</Text>
        </Button>
      </Stack>
    </Stack>
  );
}

export default () => (
  <NativeBaseProvider>
    <Center flex={1} px="10">
      <RegisterScreen />
    </Center>
  </NativeBaseProvider>
);
