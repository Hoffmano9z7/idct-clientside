import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import { Col, Row, Grid } from "react-native-easy-grid";
import HeadAppBar from './headAppBar';
import {checkMoveValidation,  checkIsMoveWin } from '../utils';

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMovable: false,
      moves: {
        a: [[0,0,0],[0,0,0],[0,0,0]],
        b: [[0,0,0],[0,0,0],[0,0,0]],
      },
      chess: '',
      showWinner: false,
    }
  }

  static getDerivedStateFromProps(props, state) {
    let result = {}
    if (props.isMovable !== state.isMovable)
      result.isMovable = props.isMovable;
    
    if (props.moves !== state.moves)
      result.moves = props.moves;
    
    if (props.chess !== state.chess)
      result.chess = props.chess;
    
    if (Object.keys(result).length > 0)
      return result;
    return null;
  }

  handleMove = coor => {
    const { moves, isMovable, chess } = this.state;
    if ( isMovable && checkMoveValidation(moves[chess], coor)) {
      const { token, ws } = this.props;
      ws.send(JSON.stringify({
        event: "move",
        move: coor,
        token
      }));
    }
  }

  exitGame = _ => {
    const { token, ws } = this.props;
    ws.send(JSON.stringify({
      event: "exitGame",
      token
    }));
  }

  render() {
    const { moves, isMovable } = this.state;
    const board = [[0,0,0],[0,0,0],[0,0,0]];
    return (
      <>
        <HeadAppBar title="Gameboard" callback={() => this.exitGame()}/>
        <View style={styles.container}>
          <Paragraph style={styles.text}>dasdas</Paragraph>
          <Grid>        
            {
              board.map((r, rInx) => {
                return (
                  <Row style={styles.centualize}>
                  {
                    r.map((c, cInx) => {
                      return (
                        <Col style={styles.centualize}>
                          <IconButton 
                            disabled={!isMovable || !!moves.a[rInx][cInx] || !!moves.b[rInx][cInx]}
                            icon={ !!moves.a[rInx][cInx] ? "close-box" : !!moves.b[rInx][cInx] ? "checkbox-blank-circle-outline" : "" } 
                            style={styles.box, styles.backgroundNormal}
                            onPress={() => this.handleMove([rInx, cInx])}
                            size={70}
                            color="#003f5c"
                            />
                        </Col>
                      )
                    })
                  }
                  </Row>
                )
              })
            }
          </Grid>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  backgroundNormal: {
    backgroundColor: '#14bdac',
  },
  backgroundWin: {
    backgroundColor: '#003f5c',
  },
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#14bdac",
    width: "95%",
    margin: 5,
    height: 450, 
  },
  text: {
    color: "#003f5c",
  },
  coverHeight: {
    height: 300, 
  },
  box: {
    padding: 8,
    height: 110,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#14bdac",
  },
  centualize: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});