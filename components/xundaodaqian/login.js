import React, { Component } from 'react';
import { router, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import { ip } from '../../static'

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  checkPassword = async () => {
    const params = {
      password: this.state.password,
      type: 'use'
    };

    const url = `${ip}?` + Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    fetch(url)
      .then(response => response.text())
      .then(result => {
        const { msg, code } = JSON.parse(result) || {}
        console.log(code, msg)
        if (code === 'success') {
          router.push(`/list?pwd=${this.state.password}`);
          return
        }
        Alert.alert(
          `登陆失败`,
          `${msg}`,
        )
      })
      .catch(error => {
        Alert.alert(
          '网络异常',
          `${error}`,
        )
      })
  }
  render() {
    const { password } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>登陆</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>输入卡密:</Text>
          <TextInput
            onChangeText={(text) => this.setState({ password: text })}
            value={password}
            style={styles.input}
          />
          <Button title="登陆" onPress={this.checkPassword} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
});

export default LoginPage;
