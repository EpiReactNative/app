import React from 'react';
import PropTypes from 'prop-types';
import 'moment/locale/fr';
import {
  ScrollView,
} from 'react-native';
import Post from './Post';

const PostScreen = ({ route, navigation }) => (
  <ScrollView>
    <Post targetPost={route.params.post} route={route} navigation={navigation} />
  </ScrollView>
);

export default PostScreen;

PostScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      post: PropTypes.shape({}).isRequired,
    }).isRequired,
  }).isRequired,
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
