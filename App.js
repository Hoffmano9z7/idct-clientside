import React from 'react';
import { NativeRouter, Route, Redirect, Switch } from "react-router-native";
import Login from './component/login';
import Lobby from './component/lobby';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ws: null,
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
    const { targetPage, error, ws, token, room, userId, isAuthenticated } = this.state;
    return (
      <NativeRouter>
        <Redirect to={targetPage} />
        <Switch>
          <Route exact path="/">
            <Login ws={ws} />
          </Route>
          <PrivateRoute path="/lobby" isAuthenticated={isAuthenticated}>
            <Lobby userId={userId} token={token} ws={ws} room={room} />
          </PrivateRoute>
        </Switch>
      </NativeRouter>
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