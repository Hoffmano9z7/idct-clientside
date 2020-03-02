import React from 'react';
export default class PrivateRoute extends React.Component {

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