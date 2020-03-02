import React from 'react';
import { View, Text } from 'react-native';
import BottomBar from './bottomBar';

export default class Lobby extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      room: [],
      navigation: {
        index: 0,

      }
    };
  }

  componentDidMount() {
    this.getRoom();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.room !== state.room)
      return {
        room: props.room
      };
    return null;
  }

  getRoom = () => {
    const { token, ws } = this.props;
    ws.send(JSON.stringify({
      event: "getRoom",
      token
    }));
  }

  handleEnterRoom = roomNum => {
    const { token, ws } = this.props;
    ws.send(JSON.stringify({
      event: "enterRoom",
      roomNum,
      token
    }));
  }

  render() {
    const { userId } = this.props;
    const { room } = this.state;
    return (
      <View>
        <BottomBar />
        <Text>Wellcome, {userId} </Text>
      </View>
    )
  }
}