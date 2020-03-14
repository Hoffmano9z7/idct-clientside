import * as React from 'react';
import { Appbar } from 'react-native-paper';

export default class HeadAppBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { title, sub, callback } = this.props;
    return (
      <Appbar.Header>
        <Appbar.BackAction
          onPress={callback}
        />
        <Appbar.Content
          title={title}
          subtitle={sub}
        />
      </Appbar.Header>
    );
  }
}

