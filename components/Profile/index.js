import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, FlatList, Image, TextInput } from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../client';

class Profile extends Component {

	state = {
		images: [],
		bio: ''
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

			while(images.length < 6) {
				images.push('');
			}

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

		const images = [...this.state.images.filter(img => img !== '' ), image];

		while(images.length < 6) {
			images.push('');
		}

		this.setState({
			images
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

			if(response.didCancel) {
				console.log('cancelled');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				this.addImageToUser(response.uri);
			}
		});
	}

	render() {

		return (
			<ProfileContainer>

				<ImagesContainer>
				{
					this.state.images.map((image, i) => {

						return image === '' ? (
							<TouchableWithoutFeedback
								key={ i }
								onPress={this.imageTest}
							>
								<ImageCol>
									<EmptyImage>
										<Icon name='plus-circle' size={25} color="#000" />
									</EmptyImage>
								</ImageCol>
							</TouchableWithoutFeedback>
						):

					 (
							<ImageCol key={ i }>
								<UsersImage source={{ uri: image }} />
							</ImageCol>
						)
					})
				}
				</ImagesContainer>


				<BioContainer>
					<BioInput
	        	onChangeText={(bio) => this.setState({bio})}
	        	value={this.state.bio}
						placeholder='Bio...'
						multiline
					/>
				</BioContainer>

			</ProfileContainer>
		);
	}
}

const ProfileContainer = styled.View`
	margin-top: 10px;
`;

const BioContainer = styled.View`
	padding: 10px;
	border-width: 1px;
	border-color: #ccc;
	border-radius: 4px;
	margin: 15px;
`;

const BioInput = styled.TextInput`
	height: 100px;
`;

const UsersImage = styled.Image`
	height: 80px;
	width: 80px;
	border-radius: 40px;
	background-color: #ccc;
`;

const EmptyImage = styled.View`
	height: 80px;
	width: 80px;
	border-radius: 40px;
	background-color: #ccc;
	align-items: center;
	justify-content: center;
`;

const ImagesContainer = styled.View`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
`;

const ImageCol = styled.View`
	flex-basis: 33.333%;
	align-items: center;
	margin-bottom: 10px;
`;

export default Profile;
