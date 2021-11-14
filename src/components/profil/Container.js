import React from 'react';
import PropTypes from 'prop-types';
import {
  HStack, Box, Center, Icon,
} from 'native-base';
import { Dimensions, Pressable } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import PostsContainer from './Posts';

const initialLayout = { width: Dimensions.get('window').width };

function ProfilContainer({ user, navigation }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'PostsScreen', icon: 'grid' },
    { key: 'LikesScreen', icon: 'heart' },
  ]);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'PostsScreen':
        return <PostsContainer name="posts" user={user} navigation={navigation} />;
      case 'LikesScreen':
        return <PostsContainer name="likes" user={user} navigation={navigation} />;
      default:
        return null;
    }
  };

  const renderTabBar = ({ navigationState }) => (
    <Center mb="1">
      <HStack w="50%" justifyContent="space-between" alignItems="center">
        {navigationState.routes.map((route, i) => {
          const borderColor = index === i ? '#262626' : 'transparent';
          return (
            <Pressable
              key={route.key}
              onPress={() => setIndex(i)}
            >
              <Box
                borderBottomWidth="3"
                borderColor={borderColor}
                alignItems="center"
                py="2"
                px="5"
              >
                {index === i ? (
                  <Icon as={Ionicons} name={route.icon} size="sm" color="#262626" />
                ) : (
                  <Icon as={Ionicons} name={`${route.icon}-outline`} size="sm" color="#262626" />
                )}
              </Box>
            </Pressable>
          );
        })}
      </HStack>
    </Center>
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      user={user}
    />
  );
}

export default ProfilContainer;

ProfilContainer.propTypes = {
  user: PropTypes.shape({}).isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
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
