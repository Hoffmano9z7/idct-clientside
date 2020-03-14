import React from 'react';
import { View } from 'react-native';
import { NativeRouter, Route, Redirect, Switch } from "react-router-native";
import { Banner } from 'react-native-paper';
import Login from './component/login';
import Lobby from './component/lobby';
import Room from './component/room';
import Game from './component/hoc/game';
import GeneralHOC from './component/hoc/general';
const GeneralHOCView = GeneralHOC(View);
// import PrivateRoute from './component/hoc/privateRoute';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    const playerSchma = {
      id: '',
      isReady: false,
      isMovable: false,
      moves: [[0,0,0],[0,0,0],[0,0,0]],
    }
    this.state = {
      ws: null,
      isLoading: false,
      isAuthenticated: false,
      targetPage: '',
      token: '',
      error: {
        isErr: false,
        type: 'success',
        msg: '',
      },
      userId: '',
      room: [],
      roomNum: 0,
      roomInfo: {
        a: { ...playerSchma },
        b: { ...playerSchma },
        s: [],
        isPlaying: false,
      },
      lastChess: '',
    };
  }

  handleAuth = isAuthenticated => {
    this.setState({
      isAuthenticated
    });
  }

  handleLoadingState = isLoading => this.setState({ ...this.state, isLoading});

  handleManualRedirect = targetPage => this.setState({ ...this.state, targetPage});

  handleWebSocket = () => {
    let ws = new WebSocket('wss://idct.herokuapp.com');
    ws.onopen = () => {
      console.log('Connected to the ws server.');
      this.setState({
        ...this.state,
        ws
      });
    }
    ws.onmessage = e => {
      const data = JSON.parse(e.data);
      if (data.action)
        console.log(data.action);
      if ('error' === data.status || 'warning' === data.status) {
        this.setState({
          ...this.state,
          isLoading: false,
          error: {
            isErr: true,
            type: data.status,
            msg: data.msg,
          }
        });
      } else if ('lobby' === data.action) {
        this.handleAuth(true);
        this.setState({
          ...this.state,
          isLoading: false,
          targetPage: '/lobby',
          token: data.token,
          userId: data.id,
          error: {
            isErr: false,
            type: 'success',
            msg: '',
          }
        });
      } else if ('updateRoom' === data.action) {
        this.setState({
          ...this.state,
          isLoading: false,
          token: data.token,
          room: data.room,
          error: {
            isErr: false,
            type: 'success',
            msg: '',
          }
        });
      } else if ('enterRoom' === data.action) {
        let newRoom = {...this.state.room};
        newRoom[roomNum] = data.roomInfo;
        this.setState({
          ...this.state,
          isLoading: false,
          targetPage: '/room',
          roomNum: data.roomNum,
          token: data.token,
          roomInfo: data.roomInfo, 
          error: {
            isErr: false,
            type: 'success',
            msg: '',
          }
        });
      } else if ('exitRoom' === data.action) {
        this.setState({
          ...this.state,
          isLoading: false,
          targetPage: '/lobby',
          token: data.token,
          room: data.room,
          error: {
            isErr: false,
            type: 'success',
            msg: '',
          }
        });
      } else if ('updateGame' === data.action) {
        this.setState({
          ...this.state,
          isLoading: false,
          token: data.token,
          roomInfo,
          error: {
            isErr: false,
            type: 'success',
            msg: '',
          }
        });
      }
    }
    ws.onclose = _ => {
      this.setState({
        ...this.state,
        isLoading: false,
        error: {
          isErr: true,
          type: 'info',
          msg: 'You have been disconneted.',
        }
      });
    }
    ws.onerror = e => console.log(`WebSocket Error: ${e.reason}`);
  }

  componentDidMount() {
    this.handleWebSocket();
  }

  render() {
    const { targetPage, error, ws, token, room, userId, isAuthenticated, isLoading, roomNum, roomInfo, lastChess } = this.state;
    return (
        <>
          <NativeRouter>
            <Redirect to={{
              pathname: targetPage,
              state: { from: this.props.location }
            }} />
              <Switch>
                <Route exact path="/">
                  <GeneralHOCView isLoading={isLoading}>
                    <Login ws={ws} handleLoadingState={this.handleLoadingState} />
                  </GeneralHOCView>
                </Route>
                <PrivateRoute path="/lobby" isAuthenticated={isAuthenticated}>
                  <Lobby userId={userId} token={token} ws={ws} room={room} isLoading={isLoading} handleManualRedirect={this.handleManualRedirect} />
                </PrivateRoute>
                <PrivateRoute path="/room" isAuthenticated={isAuthenticated}>
                    <Room 
                      userId={userId} 
                      token={token} ws={ws} 
                      room={room}
                      roomNum={roomNum} 
                      isLoading={isLoading} 
                      handleManualRedirect={this.handleManualRedirect}
                      />
                </PrivateRoute>
                <PrivateRoute path="/game" isAuthenticated={isAuthenticated}>
                  <Game userId={userId} chess={lastChess}
                    token={token} ws={ws} 
                    roomInfo={roomInfo} token={token}
                  />
                  {/* <Game userId={userId} 
                      token={token} ws={ws} 
                      roomInfo={roomInfo} token={token}/> */}
                </PrivateRoute>
              </Switch>
          </NativeRouter>
          <Banner
            visible={error.isErr}
            actions={[
              {
                label: 'Close',
                onPress: () => this.setState({
                  ...this.state,
                  error: {
                    isErr: false,
                    type: 'success',
                    msg: '',
                  }
                }),
              }
            ]}
          >
            {error.msg}
          </Banner>
        </>
    );
  }
}

class PrivateRoute extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={({ location }) =>
          this.props.isAuthenticated ? (
            children
          ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: location }
                }}
              />
            )
        }
      />
    );
  }
}