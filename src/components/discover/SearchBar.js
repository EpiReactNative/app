import React, { useState } from 'react';
import Constants from 'expo-constants';
import {
  Stack, Icon, Input
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const SearchBar = () => {
  return (
    <Stack
      w="100%"
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'white',
      }}
    >
        <Stack w="100%" px="4" py="3">
        <Input
          placeholder="Rechercher des utilisateurs"
          bg="#fff"
          width="100%"
          borderRadius="4"
          py="3"
          px="1"
          fontSize="14"
          _web={{
            _focus: { borderColor: 'muted.300', style: { boxShadow: 'none' } },
          }}
          InputLeftElement={
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<MaterialIcons name="search" />}
            />
          }
        />
      </Stack>
     </Stack>
  );
};

export default SearchBar;

