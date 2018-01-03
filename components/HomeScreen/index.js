import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import Loading from '../Loading';
import styled from 'styled-components/native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

var ImagePicker = require('react-native-image-picker');

import {
	LoginButton,
	AccessToken,
	GraphRequestManager,
	GraphRequest
} from 'react-native-fbsdk';

import firebase from '../../client';

class HomeScreen extends Component {

	state = {
		displayLogin: false,
		loading: true
	}

	componentDidMount() {

		this._getFbUser().catch(err => {
			console.warn(err);
		});

	}

	_addUserToDb = () => {

		const userIds = [];
		const itemsRef = firebase.database().ref('users');

		itemsRef.once('value', snapshot => {

			snapshot.forEach(childSnapshot => {
				const data = childSnapshot.val();
				userIds.push(data.userId);
			});

			if(!userIds.includes(this.state.userId)) {

				const item = {
					user: this.state.username,
					photo: this.state.photo,
					userId: this.state.userId
				}

				itemsRef.push(item);
			}

		});
	}

	_getFbUser = () => {

		return new Promise((resolve, reject) => {

			AccessToken.getCurrentAccessToken().then(data => {
					if(data) {
						let accessToken = data.accessToken;
						const responseInfoCallback = (error, result) => {
							if (error) {
								console.log(error);
								reject(error);
							} else {
								this.setState({
									username: result.name,
									photo: result.picture.data.url,
									displayLogin: false,
									userId: result.id,
									birthday: result.birthday,
									loading: false
								});
								resolve(result);
							}
						}

						if(accessToken) {
							const infoRequest = new GraphRequest('/me',
								{
									accessToken: accessToken,
									parameters: {
										fields: {
											string: 'name,picture,birthday'
										}
									}
								}, responseInfoCallback);
							// Start the graph request.
							new GraphRequestManager().addRequest(infoRequest).start();
						}
					} else {

						this.setState({
							displayLogin: true,
							loading: false
						});

					}

				}).catch(err => {

					this.setState({
						displayLogin: true
					});

					console.log('err', err);
					reject(err);
				});
		});
	}

	imageTest = () => {

		const options = {
		  storageOptions: {
		    skipBackup: true,
		    path: 'images'
		  }
		};

		ImagePicker.showImagePicker(options, (response) => {
		  console.log('Response = ', response);

		  if (response.didCancel) {
		    console.log('User cancelled image picker');
		  }
		  else if (response.error) {
		    console.log('ImagePicker Error: ', response.error);
		  }
		  else if (response.customButton) {
		    console.log('User tapped custom button: ', response.customButton);
		  }
		  else {
		    let source = { uri: response.uri };
				// source is the source of the image
		  }
		});
	}


  render() {

		if(this.state.loading) {
			return <Loading />;
		}

		if(this.state.displayLogin) {
			return (
				<FacebookButtonContainer>
					<LoginButton
						publishPermissions={["publish_actions"]}
						readPermissions={["user_birthday"]}
						onLoginFinished={
							(error, result) => {
								if (error) {
									alert("login has error: " + result.error);
								} else if (result.isCancelled) {
									alert("login is cancelled.");
								} else {

									this._getFbUser().then(() => {

										this._addUserToDb(this.state.username);
									}).catch(err => {
										console.warn(err);
									});
								}
							}
						}
						onLogoutFinished={() => alert("logout.")}
					/>
				</FacebookButtonContainer>
			);
		}

    return (

      <MainContainer>
				<NavView>
					<TouchableHighlight
						onPress={() => this.imageTest()}>
						<Icon name='user' size={25} color="#67A4FC" />
					</TouchableHighlight>

					<TouchableHighlight
						onPress={() => this.props.navigation.navigate('UserList', { userId: this.state.userId, username: this.state.username, photo: this.state.photo} )}>
						<Icon name='bolt' size={25} color="#67A4FC" />
					</TouchableHighlight>

					<TouchableHighlight
						onPress={() => this.props.navigation.navigate('UserList', { userId: this.state.userId, username: this.state.username, photo: this.state.photo} )}>
						<Icon name='comment' size={25} color="#67A4FC" />
					</TouchableHighlight>

				</NavView>

				<UserContainer>
					<UserImage source={{ uri: this.state.photo }} />
					<UsernameText>{ this.state.username }</UsernameText>
				</UserContainer>

			</MainContainer>
    );
  }
}

const MainContainer = styled.View`
	display: flex;
	flex: 1;
`

const UserContainer = styled.View`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
`

const UserImage = styled.Image`
	height: 70px;
	width: 70px;
	border-radius: 35px;
`;

const UsernameText = styled.Text`
	margin-top: 15px;
`;

const NavView = styled.View`
	margin-top: 10px;
	flex-direction: row;
	justify-content: space-around;
`;

const MenuText = styled.Text`
  color: #000;
	font-size: 18px;
`;

const FacebookButtonContainer = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`;

export default HomeScreen;
