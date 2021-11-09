import React, { useState } from 'react';
import Constants from 'expo-constants';
import { Stack, Icon, Input } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const SearchBar = () => {
  const [searching, setSearching] = useState(false);

  const onClickSearch = () => {
    if (searching === false) { setSearching(true); }
  };

  return (
    <Stack
      w="100%"
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'white',
        elevation: 2,
      }}
    >
      <Stack w="100%" px="4" py="3">
        <Input
          placeholder="Rechercher des utilisateurs"
          bg="transparent"
          width="100%"
          fontSize="14"
          onTextInput={() => onClickSearch()}
          _web={{
            _focus: { borderColor: 'muted.300', style: { boxShadow: 'none' } },
          }}
          InputLeftElement={(
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<MaterialIcons name="search" />}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

export default SearchBar;
