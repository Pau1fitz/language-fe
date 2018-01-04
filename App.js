import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './components/HomeScreen';
import UserList from './components/UserList';
import Chat from './components/Chat';
import Profile from './components/Profile';

const RootNavigator = StackNavigator({
	Home: {
		screen: HomeScreen,
		navigationOptions: {
			headerTitle: 'Home',
			headerTintColor: '#fff',
			headerStyle: { backgroundColor: '#000'},
		},
	},
  UserList: {
    screen: UserList,
    navigationOptions: {
      headerTitle: 'User List',
			headerTintColor: '#fff',
			headerStyle: { backgroundColor: '#000'},
    },
  },
	Chat: {
		screen: Chat,
		navigationOptions: {
			headerTitle: 'Chat',
			headerTintColor: '#fff',
			headerStyle: { backgroundColor: '#000'},
		},
	},
	Profile: {
		screen: Profile,
		navigationOptions: {
			headerTitle: 'Profile',
			headerTintColor: '#fff',
			headerStyle: { backgroundColor: '#000'},
		},
	},

});

export default RootNavigator;
