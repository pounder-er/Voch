import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import Constants from 'expo-constants';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert
} from 'react-native';

import fire_base from './firebase/firebase';

class Forgotpass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:null
    };
    const { navigation } = this.props;
    this.navigation = navigation;
  }

  onSendEmail=async()=>{
    await fire_base.resetUser(this.state.email,this.sendEmailSuccess,this.unsuccess);
  }

  sendEmailSuccess=()=>{
    Alert.alert(
      "Success!!!",
      "Please Check Your Email And Reset Password",
      [
          { text: "OK", onPress: () => this.navigation.navigate('Login') }
      ],
      { cancelable: false }
  );
  }

  unsuccess=(error)=>{
    Alert.alert(
      "Error!!!",
      error.message,
      [
          { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
  );
  }

  render(props) {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Image source={require('./logo2.png')} style={styles.logo} />
        </View>
        <View style={styles.bottom}>
         <TextInput
            style={styles.textInput}
            placeholder="Email"
            keyboardType='email-address'
            onChangeText={(text)=>this.setState({email:text})}
          />
          <TouchableOpacity style={styles.botton} onPress={this.onSendEmail}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Recovery</Text>
          </TouchableOpacity>
          
        </View>
        <StatusBar style="light" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  top: {
    flex: 1,
    backgroundColor: '#6E7D75',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
  },
  logo: {
    resizeMode: 'contain',
    height: 100,
    width: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  textInput: {
    borderWidth: 1,
    height: 40,
    borderRadius: 7,
    borderColor: 'gray',
    paddingStart: 10,
    marginBottom: 10,
  },
  botton: {
    height: 40,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBA966',
    marginBottom: 15,
  },
});

export default Forgotpass;