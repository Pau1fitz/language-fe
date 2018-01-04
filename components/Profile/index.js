import React, { Component } from 'react';
import { View, Text, TouchableHighlight, FlatList, Image } from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-picker';
import firebase from '../../client';

class Profile extends Component {

	state = {
		images: []
	}

	componentDidMount() {

		const { userId } = this.props.navigation.state.params;

		const userRef = firebase.database().ref('users').child(userId).child('images');

		const images = [];

		userRef.once('value', snapshot => {
			snapshot.forEach(childSnapshot => {
				const data = childSnapshot.val().image;
				images.push(data);
			});

			console.log(images)

			this.setState({
				images
			});

		});

	}

	addImageToUser = (image) => {

		const { userId } = this.props.navigation.state.params;

		const userRef = firebase.database().ref('users').child(userId).child('images');

		userRef.push({
			image
		});

		this.setState({
				images: [...this.state.images, image]
		});

		this.forceUpdate();

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

			if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = { uri: response.uri };
				this.addImageToUser(response.uri);
				console.log(source);
				// source is the source of the image
			}
		});
	}

	render() {

		return (
			<View>

				<TouchableHighlight onPress={this.imageTest}>
					<Text>IMAGES</Text>
				</TouchableHighlight>

				<ImagesContainer>
				{
					this.state.images.map(image => {
						return (
							<UsersImage key={ image } source={{ uri: image }} />
						)
					})
				}
				</ImagesContainer>
			</View>
		);
	}
}


const UsersImage = styled.Image`
	height: 70px;
	width: 70px;
	border-radius: 35px;
`;

const ImagesContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
`;

export default Profile;
