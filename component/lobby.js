import React from 'react';
import { Text, View } from 'react-native';

export default class Lobby extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      room: [],
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
        <Text>Wellcome, {userId} </Text>
      </View>
    )
  }
}