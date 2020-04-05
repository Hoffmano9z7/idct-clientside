import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import HeadAppBar from './headAppBar';
import { Asset } from 'expo-asset';
// import GeneralHOC from './hoc/general';
// const GeneralHOCView = GeneralHOC(View);

export default class Lobby extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      roomInfo: [],
    };
  }

  componentDidMount() {
    // this.getRoom();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.roomInfo !== state.roomInfo)
      return {
        roomInfo: props.roomInfo
      };
    return null;
  }

  // getRoom = () => {
  //   const { token, ws } = this.props;
  //   ws.send(JSON.stringify({
  //     event: "getRoom",
  //     token
  //   }));
  // }

  enterRoom = roomNum => {
    const { token, ws } = this.props;
    ws.send(JSON.stringify({
      event: "enterRoom",
      roomNum: 0, //FIXME: HARD CODE
      token
    }));
  }

  render() {
    const { userId, isLoading, handleManualRedirect } = this.props;
    // const { room } = this.state;
    return (
      <View style={styles.background}>
        <HeadAppBar title="Lobby" sub={`Welcome, ${userId}`} callback={() => handleManualRedirect("/")}/>
        {/* <GeneralHOCView isLoading={isLoading}> */}
          <ScrollView contentContainerStyle={styles.container}>
          <Card key={"room0"} style={styles.card}>
            <Card.Content>
              <Title style={styles.text}>Room 1</Title>
              {/* <Paragraph style={styles.text}>Players: {players.join(", ")}</Paragraph> */}
            </Card.Content>
            <Card.Cover style={styles.coverHeight} source={{uri: Asset.fromModule(require('../assets/tictactoe.png')).uri}} />
            <Card.Actions>
              <Button type="outlined" onPress={ () => this.enterRoom(0)} style={styles.text}>Enter</Button>
            </Card.Actions>
          </Card>
          </ScrollView>
        {/* </GeneralHOCView> */}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  background: {
    backgroundColor: '#003f5c',
  },
  container: {
    backgroundColor: '#003f5c',
    alignItems: 'center',
    minHeight: 1500,
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
  }
});