import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from '../Loading';
import firebase from '../../client';

class Profile extends Component {

	state = {
		images: [],
		bio: '',
		loading: true
	}

	componentDidMount() {

		const { userId } = this.props.navigation.state.params;

		const userRef = firebase.database().ref('users').child(userId);

		const images = [];

		// get bio
		userRef.child('bio').once('value', snapshot => {
			this.setState({
				bio: snapshot.val()
			});
		});

		// get user images
		userRef.child('images').once('value', snapshot => {
			snapshot.forEach(childSnapshot => {
				const data = childSnapshot.val().image;
				images.push(data);
			});

			while(images.length < 6) {
				images.push('');
			}

			this.setState({
				images,
				loading: false
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


	addImages = () => {

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

	saveBio = () => {

		const { userId } = this.props.navigation.state.params;

		const userRef = firebase.database().ref('users').child(userId);

		userRef.update({
			bio: this.state.bio
		});

		this.bioInput.blur();

	}

	render() {

		if(this.state.loading) {
			return <Loading />;
		}

		return (
			<ProfileContainer>

				<ImagesContainer>
				{
					this.state.images.map((image, i) => {

						return image === '' ? (
							<TouchableWithoutFeedback
								key={ i }
								onPress={this.addImages}
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
					<TextInput
						style={{ height: 100 }}
	        	onChangeText={(bio) => this.setState({bio})}
	        	value={this.state.bio}
						placeholder='Bio...'
						multiline
					 	ref={(input) => { this.bioInput = input; }}
					/>
				</BioContainer>

				<TouchableOpacity onPress={this.saveBio}>
				 <ButtonContainer>
					 <ButtonText>Save</ButtonText>
				 </ButtonContainer>
			 </TouchableOpacity>

			</ProfileContainer>
		);
	}
}

const ProfileContainer = styled.View`
	margin-top: 45px;
`;

const ButtonContainer = styled.View`
	align-content: center;
	padding: 10px;
	width: 80px;
	background-color: #000;
	margin: 5px 15px;
	border-radius: 4px;
`;

const ButtonText = styled.Text`
	color: #fff;
	text-align: center;
`;

const BioContainer = styled.View`
	padding: 10px;
	border-width: 1px;
	border-color: #ccc;
	border-radius: 4px;
	margin: 10px 15px;
	background-color: #fff;
`;

const UsersImage = styled.Image`
	height: 90px;
	width: 90px;
	border-radius: 45px;
	background-color: #ccc;
	border-width: 2;
	border-color: #fff;
`;

const EmptyImage = styled.View`
	height: 90px;
	width: 90px;
	border-radius: 45px;
	background-color: #ccc;
	align-items: center;
	justify-content: center;
	border-width: 2;
	border-color: #fff;
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
