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
  TouchableNativeFeedback,
  SafeAreaView,
  ScrollView,
  Modal,
  FlatList,
  Alert
} from 'react-native';

import RNPoll, { IChoice } from "react-native-poll";
import RNAnimated from "react-native-animated-component";

import { MaterialCommunityIcons } from '@expo/vector-icons';


import { connect } from 'react-redux';
import { addFriend, addpoll } from './actions/profile';

import fire_base from './firebase/firebase';

import { RadioButton } from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';


// var choices: Array<IChoice> = [
//   { id: 1, choice: "Nike", votes: 17 },
//   { id: 2, choice: "Adidas", votes: 7 },
//   { id: 3, choice: "Puma", votes: 1 },
//   { id: 4, choice: "Reebok", votes: 5 },
//   { id: 5, choice: "Under Armour", votes: 9 },
// ];

import Spinner from 'react-native-loading-spinner-overlay';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choices: [],
      choicesitem: [],
      idchoice: 2,
      typepoll: 'realtimeResult',
      titlepoll: '',
      listPoll: null,

      firstname: this.props.profile.firstname,
      lastname: this.props.profile.lastname,
      imageUri: this.props.profile.imageUri,
      id: this.props.id,

      swipeablePanelActive: false,

      modalVisible: false,

      listfriend: [],

      spinner: false,

       checklistening: true

    };
  }

  async componentDidMount() {
    this.setState({ spinner: true });
    await fire_base.listeningProfileFriend(this.props.id, this.listeningProfileFriendSuccess, this.unsuccess);
    
  }

  listeningProfileFriendSuccess = () => {
    fire_base.getAllFriend(this.props.id, this.getAllFriendSuccess, this.unsuccess);
  }

  getAllFriendSuccess = (querySnapshot) => {
    let friends = [];
    querySnapshot.forEach(function (doc) {
      let profile = {
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        imageUri: doc.data().imageUri,
        friends: doc.data().friends,
        id: doc.id
      }
      friends.push(profile);
      //console.log(doc.data().firstname);
    });
    this.props.add(friends);
    this.getAllPoll();
  }

  getAllPoll = async () => {
    let listfriend = [];
    listfriend.push(this.props.id);
    this.props.friends.forEach((doc) => {
      listfriend.push(doc.id);
    });
    //console.log(listfriend);
    await this.setState({ listfriend: listfriend })
    await fire_base.getAllPoll(listfriend, this.getAllPollSuccess, this.unsuccess);
    if(this.state.checklistening){
      await fire_base.listeningPoll(this.state.listfriend, this.listeningPollSuccess, this.unsuccess);
      this.setState({checklistening:false});
    }
  }

  listeningPollSuccess = async() => {
    await fire_base.getAllPoll(this.state.listfriend, this.getAllPollSuccess, this.unsuccess);
  }

  getAllPollSuccess = (querySnapshot) => {
    let listPoll = [];
    //let t = new Date(1970, 0, 1);
    querySnapshot.forEach((doc) => {
      //console.log(doc.data());
      let poll = {
        firstname: doc.data().firstname,
        lastname: doc.data().lastname,
        id: doc.id,
        state: doc.data().state,
        typepoll: doc.data().typepoll,
        uservote: doc.data().uservote,
        imageUri: doc.data().imageUri,
        totalvotes: doc.data().uservote.length + 1,
        title: doc.data().title,
        iduser: doc.data().iduser,
        checkvote: { state: false, choiceid: null },
      }
      if(doc != null){
        poll.date = doc.data().date.toDate();
      }
      doc.data().uservote.forEach((element) => {
        if (element.id == this.props.id) {
          poll.checkvote = {
            state: true,
            choiceid: element.choiceid
          }
        }
      })

      let choices: Array<IChoice> = doc.data().choices;
      poll.choices = choices;

      listPoll.push(poll);
      //console.log(poll);
    });

    this.props.addpoll(listPoll);
    this.setState({ listPoll: listPoll });
    this.setState({ spinner: false });
    //await console.log(listPoll);
  }


  setValue = async (text, id) => {
    let arr = await this.state.choices;
    arr[id].choice = await text;
    await this.setState({ choices: arr });
    //console.log(this.state.choices);
  }

  onAddChoiceItem = () => {
    let id = this.state.idchoice;
    let choice = { id: id + 1, choice: '', votes: 0 };
    this.setState({ choices: this.state.choices.concat(choice) });


    let item = <TextInput key={this.state.idchoice}
      onChangeText={(text) => this.setValue(text, id)}
      placeholder={'Choice ' + (this.state.idchoice + 1)}
      style={{ borderWidth: 1, height: 45, borderRadius: 10, paddingStart: 8, marginBottom: 5, borderColor: 'lightgray' }} />;

    this.setState({ choicesitem: this.state.choicesitem.concat(item) });
    this.setState({ idchoice: this.state.idchoice += 1 });

  }

  onCreatePoll = async () => {

    this.setState({ spinner: true });
    let poll = await {
      choices: this.state.choices,
      typepoll: this.state.typepoll,
      state: true,
      title: this.state.titlepoll,
      uservote: [],
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      iduser: this.state.id,
      imageUri: this.state.imageUri,
    };
    await fire_base.createPoll(poll, this.createPollSuccess, this.unsuccess);
  }

  createPollSuccess = (docref) => {
    this.closeModal();
    this.setState({ titlepoll: '' });
    this.setState({ spinner: false });
  }

  unsuccess = (error) => {
    console.log(error);
    this.setState({ spinner: false });
  }

  openModal = () => {
    this.setState({ choices: [{ id: 1, choice: '', votes: 0 }, { id: 2, choice: '', votes: 0 }] })
    this.setState({
      choicesitem: [<TextInput key={0}
        onChangeText={(text) => this.setValue(text, 0)}
        placeholder='Choice 1'
        style={{ borderWidth: 1, height: 45, borderRadius: 10, paddingStart: 8, marginBottom: 5, borderColor: 'lightgray' }} />,
      <TextInput key={1}
        onChangeText={(text) => this.setValue(text, 1)}
        placeholder='Choice 2'
        style={{ borderWidth: 1, height: 45, borderRadius: 10, paddingStart: 8, marginBottom: 5, borderColor: 'lightgray' }} />]
    });
    this.setState({ modalVisible: true });

  }
  closeModal = () => {
    this.setState({ choicesitem: [] });
    this.setState({ modalVisible: false });
    this.setState({ typepoll: 'realtimeResult' });
    this.setState({ titlepoll: '' });
    this.setState({idchoice: 2});
    this.setState({choices:[]});
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 3,
        }}
      />
    );
  };

  onChooseChoice = async (selectedChoice, item) => {
    //console.log(item);
    await setTimeout(async () => {
      let uservote = await {
        id: this.props.id,
        choiceid: selectedChoice.id,
      }

      await fire_base.updatePoll(item.id, uservote, this.updatePollSuccess, this.unsuccess);
    }, 2000);


  }

  updatePollSuccess = async () => {

  }




  onEndVoch = async(item) => {
    await Alert.alert(
      "",
      'Are you sure to end Voch?',
      [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
        { text: "Confirm", onPress: async() => await fire_base.setStatePoll(item.id, false, this.setStatePollSuccess, this.unsuccess) },
      ],
      { cancelable: false }
    );

  }



  setStatePollSuccess = () => {

  }

  removePoll=async(item)=>{
    await Alert.alert(
      "",
      'Are you sure to remove Voch Poll?',
      [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
        { text: "Confirm", onPress: async() => await fire_base.removePoll(item.id, this.removePollSuccess,this.unsuccess) },
      ],
      { cancelable: false }
    );
  }

  removePollSuccess=()=>{
  }

  renderItem = ({ item }) => {
    return (

      <View style={{ flexDirection: 'row', flex: 1, padding: 10, backgroundColor: 'white', borderRadius: 25 }}>
        <Image source={{ uri: item.imageUri }} style={{ height: 60, width: 60, borderRadius: 50 }} />
        <View style={{ paddingLeft: 8, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.firstname + ' ' + item.lastname}</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>{item.date.getDate()}/{item.date.getMonth() + 1}/{item.date.getFullYear()} {item.date.getHours()}:{item.date.getMinutes()}</Text>
          <Text style={{ fontSize: 16, paddingTop: 6 }}>{item.title}</Text>
          {item.checkvote.state == false && item.typepoll == 'realtimeResult' && item.state == true && (

            <RNPoll
              borderColor='gray'
              fillBackgroundColor="#ecbcb0"
              animationDuration={750}
              totalVotes={item.totalvotes}
              choices={item.choices}
              hasBeenVoted={false}
              selectedChoice={IChoice}
              onChoicePress={(selectedChoice: IChoice) => {
                //console.log("SelectedChoice: ", selectedChoice);
                this.onChooseChoice(selectedChoice, item);
              }
              }

            />
          )}
          {item.checkvote.state == false && item.typepoll == 'nonRealtimeResult' && item.state == true && (
            <RNPoll
              borderColor='gray'
              animationDuration={750}
              totalVotes={item.totalvotes}
              choices={item.choices}
              hasBeenVoted={false}
              selectedChoice={IChoice}
              onChoicePress={(selectedChoice: IChoice) => {
                //console.log("SelectedChoice: ", selectedChoice);
                this.onChooseChoice(selectedChoice, item);
              }
              }
              fillBackgroundColor='white'
              percentageTextStyle={{ color: 'white' }}
            />
          )}
          {((item.checkvote.state == true && item.typepoll == 'realtimeResult') || item.state == false)
            && (
              <RNPoll
                borderColor='gray'
                fillBackgroundColor="#ecbcb0"
                animationDuration={750}
                totalVotes={item.totalvotes - 1}
                choices={item.choices}
                hasBeenVoted={true}
                selectedChoice={IChoice}
                votedChoiceByID={item.checkvote.choiceid}
                onChoicePress={(selectedChoice: IChoice) => {
                  //console.log("SelectedChoice: ", selectedChoice);
                  this.onChooseChoice(selectedChoice, item);
                }
                }
              />
            )}
          {item.checkvote.state == true && item.typepoll == 'nonRealtimeResult' && item.state == true
            && (
              <RNPoll
                borderColor='gray'
                animationDuration={750}
                totalVotes={item.totalvotes - 1}
                choices={item.choices}
                hasBeenVoted={true}
                selectedChoice={IChoice}
                votedChoiceByID={item.checkvote.choiceid}
                onChoicePress={(selectedChoice: IChoice) => {
                  //console.log("SelectedChoice: ", selectedChoice);
                  this.onChooseChoice(selectedChoice, item);
                }
                }
                fillBackgroundColor='white'
                percentageTextStyle={{ color: 'white' }}
              />
            )}

          {item.iduser == this.props.id && item.state && (
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#eba966', borderRadius: 5, marginTop: 10 }} onPress={() => this.onEndVoch(item)}>
              <Text style={{ color: 'white' }}>voch opening</Text>
            </TouchableOpacity>
          )}
          {item.iduser != this.props.id && item.state && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#eba966', borderRadius: 5, marginTop: 10 }}>
              <Text style={{ color: 'white' }}>voch opening</Text>
            </View>
          )}
          {!item.state && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: 'lightgray', borderRadius: 5, marginTop: 10 }}>
              <Text style={{ color: 'white' }}>voch closed</Text>
            </View>
          )}



          <View style={{ flexDirection: 'row', flex: 1, paddingTop: 5 }}>

            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
              <Text style={{ fontSize: 13, color: 'gray' }}>{item.totalvotes - 1} votes</Text>
            </View>

          </View>


        </View>
        <View style={{width:15}}>
          {item.iduser==this.props.id&&(
            <TouchableOpacity onPress={()=>this.removePoll(item)}>
            <Ionicons name="ios-close" size={26} color="lightgray" />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
        <View style={styles.header}>
          <Text style={{ fontSize: 26, color: '#ce7870' }}>VOCH</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            data={this.state.listPoll}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            style={{ padding: 5 }}
          />

        </View>
        <TouchableOpacity style={styles.buttonCreate} onPress={this.openModal}>
            <MaterialCommunityIcons name="file-document-box-plus-outline" size={40} color="white" />
        </TouchableOpacity>


        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          hardwareAccelerated={true}
          onRequestClose={this.closeModal}
        >
          <View style={{ flexDirection: 'column', padding: 15, flex: 1, paddingTop: 30 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: this.state.imageUri }} style={{ height: 50, width: 50, resizeMode: 'cover', borderRadius: 50 }} />
              <TextInput placeholder="What Where When Why?" style={{ paddingStart: 8, fontSize: 16, flex: 1, paddingRight: 5 }} onChangeText={(text) => this.setState({ titlepoll: text })} />
              <TouchableOpacity style={{ padding: 5, backgroundColor: 'gray', borderRadius: 5, height: 30, alignItems: 'center', justifyContent: 'center' }} onPress={this.closeModal}>
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 2, padding: 5, backgroundColor: '#eba966', borderRadius: 5, height: 30, alignItems: 'center', justifyContent: 'center' }} onPress={this.onCreatePoll}>
                <Text style={{ color: 'white' }}>Voch</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
              <RadioButton.Group onValueChange={Value => this.setState({ typepoll: Value })} value={this.state.typepoll}>
                <RadioButton value='realtimeResult' />
                <Text style={{ color: 'gray' }}>Show realtime result</Text>
                <RadioButton value='nonRealtimeResult' />
                <Text style={{ color: 'gray' }}>Hide realtime result</Text>
              </RadioButton.Group>
            </View>

            <View style={{ flexDirection: 'column', flex: 1 }}>
              <ScrollView vertical style={{ height: '100%' }}>
                {this.state.choicesitem}
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                  <TouchableOpacity onPress={this.onAddChoiceItem}>
                    <MaterialCommunityIcons name="playlist-plus" size={30} color="gray" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <StatusBar style='dark' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'flex-end'
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
  content: {
    flex: 1,
  },
  buttonCreate: {
    height: 65,
    width: 65,
    position: 'absolute',
    backgroundColor: '#6e7d75',
    bottom: 20,
    right: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'

  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    add: (payload) => dispatch(addFriend(payload)),
    addpoll: (payload) => dispatch(addpoll(payload))
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profileReducer.profile,
    id: state.profileReducer.id,
    friends: state.profileReducer.friends
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);