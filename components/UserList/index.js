import React, { Component } from 'react';
import { ScrollView, Text, FlatList, View, Image, TouchableHighlight } from 'react-native';
import firebase from '../../client';
import styled from 'styled-components/native';

class UserList extends Component {

	state = {
		users: []
	}

	componentDidMount() {

		const usersRef = firebase.database().ref('users');

		let users = [];

		this.props.navigation.state.params.userId

		usersRef.once('value', snapshot => {
			snapshot.forEach(childSnapshot => {
				const data = childSnapshot.val();
				users.push(data);
			});

			this.setState({
				users
			})
		});

	}

	render() {

		return (
			<ScrollView>
				<FlatList
					data={
						this.state.users
					}
					renderItem={({item}) => {

						if(item.userId !== this.props.navigation.state.params.userId) {
							return (
								<TouchableHighlight
									onPress={
										() => {
											this.props.navigation.navigate(
												'Chat', { otherUserId: item.userId, avatar: this.props.navigation.state.params.photo, username: this.props.navigation.state.params.username, userId: this.props.navigation.state.params.userId }
											)
										}
									}
									underlayColor="white"
								>
									<UserContainer>
										<UserImage source={{uri: item.photo}} />
										<UserName>{item.user}</UserName>
									</UserContainer>
								</TouchableHighlight>
							)
						}
					}
				}
				keyExtractor={(item, index) => index}
			/>
			</ScrollView>
		)
	}
}

const UserContainer = styled.View`
	flex-direction: row;
	align-items: center;
	border-bottom-color: #ccc;
	border-bottom-width: 1;
	padding: 10px;
`;

const UserImage = styled.Image`
	height: 50;
	width: 50;
	border-radius: 25px;
`

const UserName = styled.Text`
	margin-left: 10px;
`

export default UserList;
