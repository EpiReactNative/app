import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';

import connectedHomeScreen from '../screens/HomeScreen';

const Tab = createMaterialBottomTabNavigator();

export class TabNavigator extends Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.fetchUser();
  }

  render() {
    return (
      <Tab.Navigator initialRouteName="Feed" labeled={false}>
        <Tab.Screen
          name="Accueil"
          component={connectedHomeScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate('Add');
            },
          })}
          // options={{
          //   tabBarIcon: ({ color }) => (
          //     <MaterialCommunityIcons name="home" color={color} size={26} />
          //   ),
          // }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) => ({
  actions: bindActionCreators({ fetchUser }, dispatch),
});

export default connect(mapStateToProps, mapDispatchProps)(TabNavigator);
