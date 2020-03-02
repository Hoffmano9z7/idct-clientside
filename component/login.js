import React from 'react';
import { TouchableWithoutFeedback, Keyboard, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Input from './input';
import GeneralHOC from './hoc/general';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      pw: '',
      isUidValid: null,
      isPwdValid: null,
    }
  }
  

  postLogin = () => {
    this.authRequest('login');
  }

  postRegister = () => {
    this.authRequest('reg');
  }

  authRequest = event => {
    this.props.handleLoadingState(true);
    const { id, pw, isUidValid, isPwdValid } = this.state;
    const checkValidList = [isUidValid, isPwdValid];
    for (const check of checkValidList) {
      if (check) {
        for (const isValid of check) {
          if (!isValid) {
            console.log('invalid')
            this.props.handleLoadingState(false);
            return;
          }
        }
      } else {
        console.log('invalid')
        this.props.handleLoadingState(false);
        return;
      }
    }
    this.props.ws.send(JSON.stringify({
      event,
      id,
      pw,
    }));
  }

  render() {
    const { isUidValid, isPwdValid } = this.state;
    // TODO: Hoffman - make the TouchableWithoutFeedback as a HOC
    return (
      <>
        <Text style={styles.logo}>Tic Tac Toe</Text>
        <View style={styles.inputView} >
          <Input
            style={styles.inputText}
            placeholder="User ID"
            placeholderTextColor="#003f5c"
            pattern={[
              '^.{8,15}$', // min 8, max 12 chars
              '[A-Za-z]', // uppercase letter
            ]}
            onValidation={isUidValid => this.setState({ isUidValid })}
            onChangeText={id => this.setState({ id })} />
        </View>
        <View style={styles.inputView} >
          <Input
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            pattern={[
              '^.{8,15}$', // min 8, max 15 chars
              '(?=.*\\d)', // number required
              '(?=.*[A-Z])', // uppercase letter
            ]}
            onValidation={isPwdValid => this.setState({ isPwdValid })}
            onChangeText={pw => this.setState({ pw })} />
        </View>
        <View>
          {!!isUidValid && (
            <View>
              {!(isUidValid[0] && isUidValid[1]) && (
                <Text style={styles.text}>
                  Invalid User ID:
                </Text>
              )}
              {!isUidValid[0] && (
                <Text style={{ color: 'red' }}>
                  Only allow 8 - 12 characters
                </Text>
              )}
              {!isUidValid[1] && (
                <Text style={{ color: 'red' }}>
                  No numeric or special characters is allowed
                </Text>
              )}
            </View>
          )}
          <View>
            <Text style={styles.text}>
              Password Policy:
            </Text>
            <Text style={{ color: isPwdValid && isPwdValid[0] ? 'green' : 'red' }}>
              Rule 1: length between 8 - 15 characters
            </Text>
            <Text style={{ color: isPwdValid && isPwdValid[1] ? 'green' : 'red' }}>
              Rule 2: number required
            </Text>
            <Text style={{ color: isPwdValid && isPwdValid[2] ? 'green' : 'red' }}>
              Rule 3: uppercase letter
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity> */}
        <TouchableOpacity onPress={this.postLogin} style={styles.loginBtn}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.postRegister}>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  forgot: {
    color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white"
  },
  text: {
    color: "#fb5b5a",
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default GeneralHOC(Login);