import React, { Component } from 'react';
import { View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styled from 'styled-components/native';
import firebase from '../../client';
import Loading from '../Loading';

class Chat extends Component {

	state = {
		message: '',
		messages: [],
		userId: null,
		loading: true
	}

	componentDidMount() {

		console.log('mounted')

		const { userId, otherUserId } = this.props.navigation.state.params;

		fetch(`http://192.168.0.14:3000/messages/${userId}/${otherUserId}`).then(res => {
			return res.json();
		}).then(res => {

			this.setState({
				messages: res,
				loading: false
			});

		}).catch(err => {
			console.warn(err);
		});

		// set up ws connection
		this.ws = new WebSocket('ws://192.168.0.14:3000');

		// handle ws error
		this.ws.onerror = e => this.setState({ error: 'WebSocket error' });

		//handle when message received from ws
		this.ws.onmessage = e => {
			this.setState({
				messages: [...this.state.messages, JSON.parse(e.data)]
			});
		}

	}

	updateText = (e) => {
		this.setState({
			message: e
		});
	}

	sendMessage = (e) => {

		e[0].user.name = this.props.navigation.state.params.username;
		e[0].user.avatar = this.props.navigation.state.params.avatar;
		e[0].otherUserId = this.props.navigation.state.params.otherUserId;
		e[0].senderId = e[0].user._id;

		this.ws.send(JSON.stringify(
			e[0]
		));

		this.setState({
			message: ''
		});
	}

	renderBubble (props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor:'#000'
					}
				}}
			/>
		)
	}

  render() {

		const { userId } = this.props.navigation.state.params;

		if(this.state.loading) {
			 return <Loading />;
		}

    return (
      <MainContainer>
				<GiftedChat
				 messages={this.state.messages}
				 renderBubble={this.renderBubble}
				 onInputTextChanged={this.updateText}
				 onSend={this.sendMessage}
				 user={{ _id: userId }}
				/>
			</MainContainer>
    );
  }
}

const MainContainer = styled.View`
	display: flex;
	flex: 1;
`

export default Chat;
