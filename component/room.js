import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, } from 'react-native-paper';
import HeadAppBar from './headAppBar';

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    const playerSchma = {
      id: '',
      isReady: false,
      isMovable: false,
      moves: [[0,0,0],[0,0,0],[0,0,0]],
    }
    this.state = {
      // room: [],
      roomInfo: {
        a: { ...playerSchma },
        b: { ...playerSchma },
        s: [],
        isPlaying: false,
      },
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

  getReady = _ => {
    const { token, ws } = this.props;
    ws.send(JSON.stringify({
      event: "ready",
      roomNum: 0,
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
          { !!roomInfo.a && userId === roomInfo.a.id && <Text style={styles.text}>You are the player using X.</Text>}
          { !!roomInfo.b && userId === roomInfo.b.id && <Text style={styles.text}>You are the player using O.</Text>}
          { !!roomInfo.s && roomInfo.s.filter(id => userId != id).length > 0 && (
            <Text style={styles.text}>You are a spectator</Text>
          )}
          {/* <Paragraph style={styles.text}>{players.join(' VS ')}</Paragraph>
          <Paragraph style={styles.text}>Spectator: {roomInfo.s.join(', ')}</Paragraph> */}
          <Button onPress={this.getReady} type="outlined" style={styles.text}>Ready</Button>
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
    minHeight: 50,
    color: "#fb5b5a",
    fontWeight: "bold",
    fontSize: 26,
  }
});