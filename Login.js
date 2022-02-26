import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
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

import {connect} from 'react-redux';
import { addProfile } from './actions/profile';

import Spinner from 'react-native-loading-spinner-overlay';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:null,
      password:null,
      spinner: false
    };
    const {navigation} = this.props;
    this.navigation = navigation;
  }


  onLogin=async()=>{
    if(this.state.email != null && this.state.email != null){
      this.setState({spinner:true});
    }
    await fire_base.login(this.state.email,this.state.password,this.loginSuccess,this.unsuccess)
  }

  loginSuccess=async(data)=>{
    //console.log(data.user.uid);
    await fire_base.getProfile(data.user.uid, this.getProfileSuccess, this.unsuccess)
  }

  getProfileSuccess=async(querySnapshot)=>{
    let profile = null;
    await querySnapshot.forEach(function(doc){
      profile = {
          vochid: doc.data().vochid,
          id: doc.id,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          studentid: doc.data().studentid,
          imageUri: doc.data().imageUri,
          uid: doc.data().uid
      };
      //console.log(doc.data());
    });
    profile.email = this.state.email;
    console.log('login success');
    
    this.props.add(profile);
    //console.log(this.props.profile);
    this.setState({spinner:false});
    this.props.navigation.navigate('BottomTab');
    this.navigation.reset({index:0,routes:[{name:'BottomTab'}]});
  }

  unsuccess=(error)=>{
    console.log(error.message);
    this.setState({spinner:false});
    Alert.alert(
      "Error!!!",
      error.message,
      [
          { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
  );
  }

  onForgotPassword=()=>{
    this.navigation.navigate('Forgotpass');

  }

  onCreateAccount=()=>{
    this.navigation.navigate('Registration');
    
  }

  render(props) {
    return (
      <View style={styles.container}>
         <Spinner
          visible={this.state.spinner}
          animation='fade'
          size='large'
        />
        <View style={styles.top}>
          <Image source={require('./logo2.png')} style={styles.logo} />
        </View>
        <View style={styles.bottom}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(text)=>this.setState({email:text})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text)=>this.setState({password:text})}
          />

          {/* <TextInput style={styles.textInput2}>1</TextInput>
          <TextInput style={styles.textInput2}>2</TextInput>
          <TextInput style={styles.textInput2}>3</TextInput>
          <TextInput style={styles.textInput2}>4</TextInput>
          <TextInput style={styles.textInput2}>5</TextInput> */}


          <TouchableOpacity style={styles.bottonLogin} onPress={this.onLogin}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.bottonForgotPass} onPress={this.onForgotPassword}>
              <Text
                style={{
                  color: '#EBA966',
                  fontWeight: 'bold',
                  alignItems: 'center',
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewOR}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  flex: 1,
                  borderColor: '#C1C1C1',
                }}></View>
              <View style={{ flex: 1 }}></View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
              }}>
              <Text style={{ color: '#C1C1C1' }}>OR</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  flex: 1,
                  borderColor: '#C1C1C1',
                }}></View>
              <View style={{ flex: 1 }}></View>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.bottonCreateAccount} onPress={this.onCreateAccount}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Create New Voch Account
              </Text>
            </TouchableOpacity>
          </View>
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
  textInput: {
    borderWidth: 1,
    height: 40,
    borderRadius: 7,
    borderColor: 'gray',
    paddingStart: 10,
    marginBottom: 10,
  },
  textInput2:{
    borderWidth:1,
    height: 40,
    borderRadius: 7,
    borderColor: 'red',
    paddingStart: 10,
    marginBottom: 10,

  },
  bottonLogin: {
    height: 40,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBA966',
    marginBottom: 15,
  },
  bottonForgotPass: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOR: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 30,
  },
  bottonCreateAccount: {
    height: 40,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CE7870',
    padding: 10,
  },
  logo: {
    resizeMode: 'contain',
    height: 100,
    width: 100,
    shadowColor: '#000',
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      add: (payload) => dispatch(addProfile(payload))
  }
}

const mapStateToProps = (state) =>{
  return{
      profile: state.profileReducer.profile
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
