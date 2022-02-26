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
} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { connect } from 'react-redux';
import { addProfile } from './actions/profile';

import fire_base from './firebase/firebase';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textButton: 'Edit',
      vochid: this.props.profile.vochid,
      firstname: this.props.profile.firstname,
      lastname: this.props.profile.lastname,
      studentid: this.props.profile.studentid,
      email: this.props.profile.email,
      imageUri: this.props.profile.imageUri,
      uid: this.props.profile.uid,
      id: this.props.id,
      stateButton: false
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
      this.setState({ imageUri: result.uri });
      await fire_base.uplaodToFirebase(this.state.imageUri, this.state.uid, this.uploadSuccess, this.unsuccess)
    }
  };

  uploadSuccess = async (uri) => {
    let profilepoll = {
      firstname: this.props.profile.firstname,
      lastname: this.props.profile.lastname,
      imageUri: uri
    }
    await fire_base.updateProfilePoll(profilepoll, this.props.id, this.props.polls);
    await fire_base.updateProfile({ imageUri: uri }, this.state.id, this.updateImageuriSuccess, this.unsuccess);
  }

  updateImageuriSuccess = async () => {
    this.props.add(this.state);
  }

  updateProfileSuccess = async () => {
    this.setState({ textButton: 'Edit' });

    let profilepoll = {
      firstname: this.props.profile.firstname,
      lastname: this.props.profile.lastname,
    }
    await fire_base.updateProfilePoll(profilepoll, this.props.id, this.props.polls);
  }

  unsuccess = (error) => {
    console.log(error);
  }

  onEditProfile = async () => {
    if (!this.state.stateButton) {
      this.setState({ textButton: 'Done' });
    } else {
      let profile = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        studentid: this.state.studentid,
      }
      console.log(profile, this.state.id);
      await fire_base.updateProfile(profile, this.state.id, this.updateProfileSuccess, this.unsuccess);

      this.props.add(this.state);
    }
    this.setState({ stateButton: !this.state.stateButton });
  }

  onSignOut = async () => {
    await fire_base.signOut(this.signoutSuccess, this.unsuccess);
  }

  signoutSuccess = () => {
    this.navigation.navigate('Login');
  }


  render(props) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 26, color: '#ce7870' }}>VOCH</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <InputScrollView>
            <View style={styles.bottom}>

              <View style={{ alignItems: 'center', marginBottom: 10 }}>
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

              <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 10 }}>{this.state.firstname} {this.state.lastname}</Text>

              <View style={{ flexDirection: 'column', flex: 1 }}>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 10, }}>
                  <Text style={{ width: 90, textAlign: 'left', paddingLeft: 5, fontWeight: 'bold' }}>First name</Text>
                  <Text style={{ textAlign: 'left', paddingLeft: 5 }}>: </Text>
                  <TextInput style={styles.textInput} placeholder="firstname" onChangeText={(text) => this.setState({ firstname: text })} value={this.state.firstname} editable={this.state.stateButton} />
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 10, }}>
                  <Text style={{ width: 90, textAlign: 'left', paddingLeft: 5, fontWeight: 'bold' }}>Last name</Text>
                  <Text style={{ textAlign: 'left', paddingLeft: 5 }}>: </Text>
                  <TextInput style={styles.textInput} placeholder="Lastname" onChangeText={(text) => this.setState({ lastname: text })} value={this.state.lastname} editable={this.state.stateButton} />
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 10, }}>
                  <Text style={{ width: 90, textAlign: 'left', paddingLeft: 5, fontWeight: 'bold' }}>Voch ID</Text>
                  <Text style={{ textAlign: 'left', paddingLeft: 5 }}>: </Text>
                  <TextInput style={styles.textInput} placeholder="Voch ID" value={this.state.vochid} editable={false} />
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 10, }}>
                  <Text style={{ width: 90, textAlign: 'left', paddingLeft: 5, fontWeight: 'bold' }}>Email</Text>
                  <Text style={{ textAlign: 'left', paddingLeft: 5 }}>: </Text>
                  <TextInput
                    style={styles.textInput} s
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCompleteType="email"
                    value={this.state.email}
                    editable={false}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.botton}
                onPress={this.onEditProfile}>
                <Text style={{ color: 'white' }}>{this.state.textButton}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 40,
                  borderRadius: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ce7870',
                  marginTop: 10
                }}
                onPress={this.onSignOut}
              >
                <Text style={{ color: 'white' }}>Log Out</Text>
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
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    height: 85,
    borderBottomWidth: 1,
    borderColor: '#C1C1C1',
    paddingTop: Constants.statusBarHeight,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  bottom: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 30,
  },
  textInput: {
    flex: 1,
    // borderWidth: 1,
    height: 40,
    borderRadius: 7,
    borderColor: 'gray',
    paddingStart: 10,
    //marginBottom: 10,
    backgroundColor: 'white',
  },
  botton: {
    height: 40,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBA966',
    marginTop: 10
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

const mapDispatchToProps = (dispatch) => {
  return {
    add: (payload) => dispatch(addProfile(payload))
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profileReducer.profile,
    id: state.profileReducer.id,
    polls: state.profileReducer.polls
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
