import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image

} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Spinner from 'react-native-loading-spinner-overlay';

import fire_base from './firebase/firebase';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    const { route } = this.props;
    this.sender = route.params.sender;
    this.reciver = route.params.profileFriend.id;
    this.profileFriend = route.params.profileFriend;
    //console.log(this.sender, "  ", this.reciver);
    this.state = {
      text: '',
      messages: [],
      room: [this.sender, this.reciver],
      spinner: false
    };
    this.inputRefs = {
      focusMessage: React.createRef(),
    }

  }

  listeningSuccess = async (snapshot) => {
    //console.log(doc.data());
    //await firestore.getAllMessage(this.state.room, this.getSuccess, this.unsuccess);
    //this.setState({ messages: this.state.messages.concat(doc.data()) });
    //this.setState({ messages: mes });
    let mes = [];
    snapshot.docChanges().forEach(function (change) {
      if (change.type === 'added') {
        let c = change.doc.data();
        c.id = change.doc.id;
        mes.push(c);
        //console.log(c);
      }
    });
    this.setState({ messages: this.state.messages.concat(mes) });
    this.setState({spinner:false});

  }


  getSuccess = (querySnapshot) => {
    let mes = []
    querySnapshot.forEach(function (doc) {
      let c = doc.data();
      c.id = doc.id;
      mes.push(c);
    });
    this.setState({ messages: mes });
    this.setState({spinner:false});
  }

  async componentDidMount() {
    this.setState({spinner:true});
    //await fire_base.getAllMessage(this.state.room, this.getSuccess, this.unsuccess);
    //console.log(this.state.room);
    await fire_base.listeningMessage(this.state.room, this.listeningSuccess, this.unsuccess);
  }



  sendSuccess = (docRef) => {
    console.log('send success');
  }

  unsuccess = (error) => {
    this.setState({spinner:false});
    console.log(error);
  }

  renderItem = ({ item }) => {
    return (
      <View>
        {item.sender === this.sender &&
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={styles.txtSender}>{item.message}</Text>
          </View>}
        {item.sender != this.sender &&
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
            style={styles.imageProfileFriend}
            source={{
              uri:this.profileFriend.imageUri,
            }} />
            <View style={{paddingTop:20}}>
            <Text style={styles.txtReceiver}>{item.message}</Text>
            </View>
          </View>}
      </View>
    );
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 8,
        }}
      />
    );
  };

  onSend = async () => {
    this.inputRefs.focusMessage.current.clear();
    this.setState({text:''})
    let messages = {
      sender: this.sender,
      room: this.state.room,
      message: this.state.text,
    }
    //console.log(messages);
    await fire_base.sendMessage(messages, this.sendSuccess, this.unsuccess);
  }

  render(props) {
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          visible={this.state.spinner}
          animation='fade'
          size='large'
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>{this.profileFriend.firstname}</Text>
        </View>

        <View style={{ flex: 1, padding: 8 }}>
          <View style={styles.content}>
            <FlatList
              data={this.state.messages}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={this.renderSeparator}
              ref={(ref) => { this.flatListRef = ref; }}
              onContentSizeChange={() => this.flatListRef.scrollToEnd()}
            />

          </View>

          <View style={styles.chatContent}>
            <TextInput
              placeholder="Message"
              style={styles.textInput}
              onChangeText={txt => { this.setState({ text: txt }) }}
              ref={this.inputRefs.focusMessage}
            />

            <TouchableOpacity
              onPress={this.onSend}>
              <MaterialCommunityIcons name="send-circle" size={50} color="gray" />
            </TouchableOpacity>
          </View>

        </View>
        <StatusBar style='dark' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    flex: 1,
    borderColor: 'gray',
    paddingStart: 20,
  },
  content: {
    flex: 1,
    //padding: 8,
    marginBottom: 8,
    //width: "100%",
  },
  chatContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "red"
  },
  txtReceiver: {
    flexWrap: 'wrap',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    //borderWidth: 1,
    padding: 8,
    marginLeft: 4,
    flexShrink: 1,
    //borderColor: "red"
    backgroundColor: '#25D366',
    color: 'white'
  },
  txtSender: {
    flexWrap: 'wrap',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    //borderWidth: 1,
    padding: 8,
    flexShrink: 1,
    //borderColor: "black"
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    height: Constants.statusBarHeight+50,

    paddingTop: Constants.statusBarHeight
  },
  headerText: {
    fontSize: 20,
    paddingLeft:15
  },
  imageProfileFriend: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 200
  },

});