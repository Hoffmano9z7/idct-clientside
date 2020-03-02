import React from 'react';
import { View } from 'react-native';
import { NativeRouter, Route, Redirect, Switch } from "react-router-native";
import Login from './component/login';
import Lobby from './component/lobby';
import PrivateRoute from './component/hoc/privateRoute';
import GeneralHOC from './component/hoc/general';
const GeneralHOCView = GeneralHOC(View);

export default class App extends React.Component {

  constructor(props) {
    super(props);

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
    };
  }

  handleAuth = isAuthenticated => {
    this.setState({
      isAuthenticated
    });
  }

  handleLoadingState = _ => this.setState({ ...this.state, isLoading: true});

  handleWebSocket = () => {
    let ws = new WebSocket('ws://idct.herokuapp.com/');
    ws.onopen = () => {
      console.log('Connected to the ws server.');
      this.setState({
        ...this.state,
        ws
      });
    }
    ws.onmessage = e => {
      const data = JSON.parse(e.data);
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
        this.setState({
          ...this.state,
          isLoading: false,
          targetPage: '/room',
          token: data.token,
          room: data.room,
          error: {
            isErr: false,
            type: 'success',
            msg: '',
          }
        });
      }
    }
    ws.onclose = e => {
      this.setState({
        ...this.state,
        error: {
          isLoading: false,
          isErr: true,
          type: 'info',
          msg: 'You have been disconneted.',
        }
      });
    }
  }

  componentDidMount() {
    this.handleWebSocket();
  }

  render() {
    const { targetPage, error, ws, token, room, userId, isAuthenticated, isLoading } = this.state;
    return (
        <NativeRouter>
          <Redirect to={targetPage} />
            <Switch>
              <Route exact path="/">
                <GeneralHOCView isLoading={isLoading}>
                  <Login ws={ws} handleLoadingState={this.handleLoadingState} />
                </GeneralHOCView>
              </Route>
              <PrivateRoute path="/lobby" isAuthenticated={isAuthenticated}>
                <Lobby userId={userId} token={token} ws={ws} room={room} />
              </PrivateRoute>
            </Switch>
        </NativeRouter>
    );
  }
}