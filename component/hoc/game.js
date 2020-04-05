import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { Col, Row, Grid } from "react-native-easy-grid";
import GameBoard from '../gameboard';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { roomInfo, token, ws, roomNum, userId } = this.props;
    const moves = {
      a: roomInfo.a.moves,
      b: roomInfo.b.moves,
    }
    const chess = roomInfo.a.id === userId ? 'a' : 'b';
    return (
      <GameBoard 
        isMovable={roomInfo[chess].isMovable}
        ws={ws}
        roomNum={roomNum}
        moves={moves} token={token} 
        chess={chess}
        />
    )
  }
}
