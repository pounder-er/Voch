import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import fire_base from './firebase/firebase';

import Spinner from 'react-native-loading-spinner-overlay';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vochid: null,
      firstname: null,
      lastname: null,
      studentId: null,
      email: null,
      password: null,
      imageUri: null,
      uid: null,
      spinner: false
    };
    const { navigation } = this.props;
    this.navigation = navigation;
  }

  onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Photo,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      console.log(result);
      await this.setState({ imageUri: result.uri });
    }
  };



  onCreateAccount = async () => {
    if (this.state.imageUri == null || this.state.firstname == null || this.state.lastname == null || this.state.email == null || this.state.password == null || this.state.vochid==null) {
      Alert.alert(
        "Error!!!",
        "Please Complete All Fields",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    }
    else {
      this.setState({spinner:true});
      await fire_base.checkVochId(this.state.vochid, this.checkVochIdSuccess, this.unsuccess)
    }
  };

  checkVochIdSuccess=async(querySnapshot)=>{
    let check = false;
    await querySnapshot.forEach(function(doc){
      check = doc.exists;
    });
    if(check){
      this.setState({spinner:false});
      Alert.alert(
        "Error!!!",
        'Voch ID already exists',
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    }else{
      this.setState({spinner:true});
      await fire_base.createUser(this.state.email, this.state.password, this.createUserSuccess, this.unsuccess);
    }
  }

  createUserSuccess = async (data) => {
    this.setState({ uid: data.user.uid });
    await fire_base.uplaodToFirebase(this.state.imageUri, data.user.uid, this.uploadSuccess, this.unsuccess);
  }

  uploadSuccess = async (uri) => {
    let profile = {
      vochid: this.state.vochid,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      studentid: this.state.studentId,
      imageUri: uri,
      uid: this.state.uid
    }
    await fire_base.addProfile(profile, this.addProfileSuccess, this.unsuccess)
    console.log(uri);
  }

  addProfileSuccess = (docref) => {
    console.log(docref);
    this.setState({spinner:false});
    this.navigation.navigate('Login');
  }

  unsuccess = (error) => {
    console.log(error);
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

  render(props) {
    return (
      <View style={styles.container}>
         <Spinner
          visible={this.state.spinner}
          animation='fade'
          size='large'
        />
        <View style={styles.top}>
          <Text style={{ fontStyle: 'italic', fontSize: 35, color: '#ce7870' }}>
            Registration
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <InputScrollView>
            <View style={styles.bottom}>
              <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <TouchableOpacity onPress={this.onPickImage}>
                  <View style={styles.photo}>
                    {this.state.imageUri == null && (
                      <MaterialCommunityIcons
                        name="image-plus"
                        size={70}
                        color="black"
                      />
                    )}
                    {this.state.imageUri != null && (
                      <Image
                        source={{ uri: this.state.imageUri }}
                        style={styles.photo}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <TextInput style={styles.textInput} placeholder="Voch ID" onChangeText={(text) => this.setState({ vochid: text })} />
              <TextInput style={styles.textInput} placeholder="firstname" onChangeText={(text) => this.setState({ firstname: text })} />
              <TextInput style={styles.textInput} placeholder="Lastname" onChangeText={(text) => this.setState({ lastname: text })} />
              {/* <TextInput
                style={styles.textInput}
                placeholder="ID"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ studentId: text })}
              /> */}

              <TextInput
                style={styles.textInput}
                placeholder="Email"
                keyboardType="email-address"
                autoCompleteType="email"
                onChangeText={(text) => this.setState({ email: text })}
              //inputAccessoryViewID='uniqueID'
              />

              <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={true}
                autoCompleteType="password"
                onChangeText={(text) => this.setState({ password: text })}
              />
              <TouchableOpacity
                style={styles.botton}
                onPress={this.onCreateAccount}>
                <Text style={{ color: 'white' }}>Create Voch Account</Text>
              </TouchableOpacity>
            </View>
          </InputScrollView>
        </View>
        <StatusBar style="dark" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  top: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight + 10,
    height: 100,
  },
  bottom: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 30,
  },
  textInput: {
    borderWidth: 1,
    height: 40,
    borderRadius: 7,
    borderColor: 'gray',
    paddingStart: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  botton: {
    height: 40,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBA966',
  },
  photo: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: '#becbcf',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
});

export default Registration;
