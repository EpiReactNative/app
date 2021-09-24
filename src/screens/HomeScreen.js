import React from 'react';
import { Button, View, Text } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';

function HomeScreen(props) {
  const { currentUser } = props;

  const onLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <View>
      <Text>
        <Text>Hello </Text>
        <Text>{currentUser && currentUser.name}</Text>
        <Text> (</Text>
        <Text>{currentUser && currentUser.email}</Text>
        <Text>)</Text>
      </Text>
      <Button title="Déconnexion" onPress={() => onLogout()} />
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps)(HomeScreen);
