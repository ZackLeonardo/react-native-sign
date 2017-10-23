import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  Text,
} from 'react-native';

import Meteor, { createContainer, Tracker } from 'react-native-meteor';

import LoginAnimation from 'react-native-sign';

Meteor.connect('ws://localhost:3000/websocket');

export default class Test extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggedIn: false,
      isLoading: false,
    }

    this._login = this._login.bind(this);
    this._logout = this._logout.bind(this);
    this._signup = this._signup.bind(this);

  }

  _showAlert(alertTitle='未连接服务器', info='请检查网络连接后重试', okInfo='好的'){
    Alert.alert(
      alertTitle,
      info,
      [
        {text: okInfo, onPress: ()=> {this.loginAnimationRef.resetStatus()}, style: 'cancel'},
      ],
      { cancelable: false }
    )
  }

  _login(username, password){
    Meteor.loginWithPassword(username, password, function(error){
        if (error){
          console.log(error);
          switch (error.reason) {
            case 'User not found':
              this._showAlert(alertTitle='提示', info='用户名尚未注册', okInfo='好的');
              break;
            case 'Incorrect password':
              this._showAlert(alertTitle='提示', info='用户名密码不匹配', okInfo='好的');
              break;
            default:
          }
          this.loginAnimationRef.resetStatus();
        }else{
          console.log('log in succesfully');
          console.log('loged in user info:' + JSON.stringify(Meteor.user()));
          this.loginAnimationRef.resetStatus(isLoggedIn=true, isLoading=false, isAppReady=true );
        }
    }.bind(this));
  }

  _logout(){

  }

  _signup(username, password, fullName){
    var username = username.trim();
    var password = password.trim();
    var fullName = fullName.trim();
    // Accounts.createUser({
    //     email: email,
    //     password: password
    // });
    // Meteor.loginWithPassword(email, password);
    if (Meteor.status().status !== 'connected'){
      this._showAlert();
    } else {
      Meteor.call('signup', username, password, fullName, (error, content) => {
        if (error){
          console.log('error: ' + JSON.stringify(error));
          switch (error.reason) {
            case 'Username already exists.':
              this._showAlert(alertTitle='提示', info='用户名已存在', okInfo='好的');
              break;
            default:

          }

        }else{
          // 登录
          this._login(username, password);

          this.loginAnimationRef.resetStatus(isLoggedIn=true, isLoading=false, isAppReady=true);
        }
      })
    }

  }


  render () {
    return (
      <LoginAnimation
        ref={ref => this.loginAnimationRef = ref}
        login={this._login}
        logout={this._logout}
        signup={this._signup}
        >
        <View>
          <Text>haha</Text>
        </View>
      </LoginAnimation>
      );
  }
}
