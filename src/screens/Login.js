import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
/* eslint-disable camelcase */
import { useFonts, LeckerliOne_400Regular } from '@expo-google-fonts/leckerli-one';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {
  Button, Stack, Center, NativeBaseProvider, Input, Icon, Text, Collapse, VStack, HStack, Alert,
  CloseIcon, IconButton,
} from 'native-base';
import authenticationActions from '../redux/actions/authentication';

function LoginScreen() {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    username: 'admin',
    password: 'admin',
  });
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setisLoggingIn] = useState(false);
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    LeckerliOne_400Regular,
  });

  const handleClick = () => setShowPassword(!showPassword);

  const handleSubmit = () => {
    setError(false);
    setisLoggingIn(true);
    authenticationActions.login(dispatch, inputs.username, inputs.password)
      .then(() => {
      })
      .catch(() => {
        setError(true);
        setisLoggingIn(false);
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
                  Une erreur est survenue
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
      <Button w="100%" size="lg" isLoggingIn={isLoggingIn} colorScheme="primary" onPress={handleSubmit} isDisabled={!inputs.username || !inputs.password}>
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

export default () => (
  <NativeBaseProvider>
    <Center flex={1} px="10">
      <LoginScreen />
    </Center>
  </NativeBaseProvider>
);
