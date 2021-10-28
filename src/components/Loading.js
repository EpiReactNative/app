import React from 'react';
import {
  Center, Heading, Spinner, HStack,
} from 'native-base';

const Loading = () => (
  <Center flex={1} px="10">
    <HStack space={2} alignItems="center">
      <Spinner accessibilityLabel="Loading posts" color="#262626" />
      <Heading color="#262626" fontSize="md">
        Chargement
      </Heading>
    </HStack>
  </Center>
);

export default Loading;
