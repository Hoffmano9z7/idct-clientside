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
    const { roomInfo, chess, token, ws, roomNum } = this.props;
    const moves = {
      a: roomInfo.a.moves,
      b: roomInfo.b.moves
    }
    return (
      <GameBoard 
        isMovable={true}
        ws={ws}
        roomNum={roomNum}
      //isMovable={roomInfo[chess].isMovable} 
        moves={moves} token={token} />
    )
  }
}
