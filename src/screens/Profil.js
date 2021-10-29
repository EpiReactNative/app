import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsyncEffect } from 'use-async-effect';
import {
  Button, Stack, Dimensions, HStack, Toast, Box, Image,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { userActions, SERVER_URL } from '../redux/actions';
import Loading from '../components/Loading';
import toasts from '../redux/helpers/toasts';
import { HeaderProfil, InfoProfil } from '../components/profil';

function ProfilScreen() {
  const { user } = useSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useAsyncEffect(async (isMounted) => {
    if (isMounted()) {
      userActions.whoami().then((data) => {
        console.log(data);
        console.log(user);
        if (isMounted()) setMounted(true);
      }).catch(() => {
        Toast.show(toasts.globalError);
      });
    }
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <Stack w="100%" h="100%">
      <HeaderProfil />
      <InfoProfil />
      <HStack w="100%" h="100%" justifyContent="space-between">
        {user.posts.map((post) => (
          <Image
            key={post.id}
            resizeMode="cover"
            source={{ uri: `${SERVER_URL}${post.image}` }}
            alt="Post Image"
            width="33%"
            height="140px"
          />
        ))}
      </HStack>
    </Stack>
  );
}

export default ProfilScreen;
