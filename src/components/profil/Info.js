import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Stack, Text, HStack, VStack, Icon, Modal, Divider, Image, Flex,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL } from '../../redux/actions';

const InfoProfil = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Stack w="100%" p="4">
      <HStack w="100%" alignItems="center" justifyContent="space-between">
        <Image
          resizeMode="cover"
          source={{ uri: `${SERVER_URL}${user.profile_picture}` }}
          width="90px"
          height="90px"
          alt="Image Profil"
          rounded="full"
        />
        <VStack alignItems="center">
          <Text fontSize="md" bold>{user.posts.length}</Text>
          <Text>Publications</Text>
        </VStack>
        <VStack alignItems="center">
          <Text fontSize="md" bold>0</Text>
          <Text>Abonnés</Text>
        </VStack>
        <VStack alignItems="center">
          <Text fontSize="md" bold>0</Text>
          <Text>Abonnements</Text>
        </VStack>
      </HStack>
      <Text mt="2" semibold>{user.bio}</Text>
      <Button my="2" py="5px" onPress={console.log('pressed')} variant="outline" colorScheme="light" borderColor="dark.500">
        <Text semibold>Modifier le profil</Text>
      </Button>
    </Stack>
  );
};

export default InfoProfil;
