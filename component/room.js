import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import HeadAppBar from './headAppBar';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],

    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.roomInfo !== state.roomInfo)
      return { roomInfo: props.roomInfo }
    return null;
  }

  exitRoom = roomNum => {
    const { token, ws } = this.props;
    ws.send(JSON.stringify({
      event: "exitRoom",
      roomNum,
      token
    }));
  }

  render() {
    const { roomInfo } = this.state;
    const { userId, isLoading, roomNum } = this.props;
    const players = [roomInfo.a.id, roomInfo.b.id];
    return (
      <> 
        <HeadAppBar title={`Room: ${roomNum != null ? roomNum + 1 : 0}`} callback={ () => this.exitRoom(roomNum)} />
        <View style={styles.container}>
          { !!roomInfo.a && userId === roomInfo.a.id && <Paragraph style={styles.text}>You are X</Paragraph>}
          { !!roomInfo.b && userId === roomInfo.b.id && <Paragraph style={styles.text}>You are O</Paragraph>}
          <Paragraph style={styles.text}>{players.join(' VS ')}</Paragraph>
          <Paragraph style={styles.text}>Spectator: {roomInfo.s.join(', ')}</Paragraph>
        </View>
      </> 
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: '#003f5c',
  },
  text: {
    color: "#fb5b5a",
    fontWeight: "bold",
    fontSize: 26,
  }
});