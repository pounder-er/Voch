import { StatusBar } from 'expo-status-bar';
import React, { Component, useRef } from 'react';
import Constants from 'expo-constants';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    StyleSheet,
    Image,
    FlatList,
    Alert
} from 'react-native';

import { EvilIcons } from '@expo/vector-icons';
import fire_base from './firebase/firebase';

import { connect } from 'react-redux';
import { addFriend } from './actions/profile';

import { SwipeablePanel } from 'rn-swipeable-panel';

import Spinner from 'react-native-loading-spinner-overlay';

class Friend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilefriend: {
                imageUri: null,
                firstname: null,
                lastname: null,
                id: null,
                friends: null
            },
            onfocus: false,
            textSearch: null,
            colorButtonAdd: 'gray',
            buttonDisable: true,
            friends: null,
            swipeablePanelActive: false,

            countfrienduser: 0,

            selectid: null,
            selectprofile: {},
            countfriend: 0,
            countpoll: 0,

            spinner: false
        };
        this.inputRefs = {
            focusSearch: React.createRef(),
        }
        const { navigation } = this.props;
        this.navigation = navigation;
    }

    async componentDidMount() {
        this.setState({ spinner: true });
        //await console.log(this.props.polls);
        await fire_base.getAllFriend(this.props.id, this.getAllFriendSuccess, this.unsuccess);
        await fire_base.listeningProfileFriend(this.props.id, this.listeningProfileSuccess, this.unsuccess);
    }

    listeningProfileSuccess = async() => {
        await fire_base.getAllFriend(this.props.id, this.getAllFriendSuccess, this.unsuccess);
    }

    getAllFriendSuccess = async (querySnapshot) => {
        let friends = [];
        let profileselect = null;
        let copyselectid = this.state.selectid;
        let countfrienduser = 0;
        querySnapshot.forEach(function (doc) {
            countfrienduser++;
            let profile = {
                firstname: doc.data().firstname,
                lastname: doc.data().lastname,
                imageUri: doc.data().imageUri,
                friends: doc.data().friends,
                id: doc.id
            }
            friends.push(profile);
            if (copyselectid != null && doc.id == copyselectid) {
                profileselect = profile;
            }
            //console.log(doc.data());
        });

        this.setState({ countfrienduser: countfrienduser });
        this.setState({ friends: friends });

        this.props.add(friends);

        if (profileselect != null) {
            this.setState({ selectprofile: profileselect });
            let arrfriend = await profileselect.friends;
            let numfriend = 0;
            arrfriend.forEach(element => {
                numfriend++;
            });
            this.setState({ countfriend: numfriend });

        }

        this.setState({ spinner: false });

    }

    updatePanel = () => {

        this.state.friends.forEach(element => {
            if (element.id == this.state.selectid) {

            }

        });

    }

    openPanel = async (item) => {

        let numpoll = 0;
        this.props.polls.forEach((doc) => {
            if (doc.iduser == item.id) {
                numpoll++;
            }
        });

        this.setState({ selectid: item.id });
        this.setState({ swipeablePanelActive: true });
        this.setState({ selectprofile: item });
        let arrfridnd = await item.friends;
        let numfriend = 0;
        await arrfridnd.forEach(element => {
            numfriend++;
        });

        this.setState({ countpoll: numpoll });
        this.setState({ countfriend: numfriend });
        //await console.log(this.state.countfriend);
    };

    closePanel = () => {
        this.setState({ swipeablePanelActive: false });
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: "#dddddd",
                }}
            />
        );
    };

    renderItem = ({ item }) => {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: "white", height: 80 }} onPress={() => this.openPanel(item)} >

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 10 }}>
                        <Image source={{ uri: item.imageUri }} style={{ height: 60, width: 60, borderRadius: 50 }} />
                        {/* <View style={{ height: 60, width: 60, backgroundColor: 'skyblue', borderRadius: 50 }} /> */}
                        <View style={{ paddingLeft: 8, flex: 1 }}>
                            {/* <Text style={{ fontSize: 18 }}>{item.username}</Text> */}
                            <Text style={{ fontSize: 18 }}>{item.firstname + ' ' + item.lastname}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
            </View>
        );
    }

    onSearch = async () => {
        await fire_base.checkVochId(this.state.textSearch, this.checkVochIdSuccess, this.unsuccess);

    }

    checkVochIdSuccess =(querySnapshot) => {
        let profile = {};
        profile.friend = null
        querySnapshot.forEach(function (doc) {
            profile.firstname = doc.data().firstname;
            profile.lastname = doc.data().lastname;
            profile.imageUri = doc.data().imageUri;
            profile.id = doc.id;
            profile.friends = doc.data().friends;
            //console.log(doc.data().friends);
        });
        let check = true;
        if(profile.friends!=null){
            profile.friends.forEach((doc) => {
                if (doc == this.props.id) {
                    check = false;
                }
            });
        }
        //console.log(check);
        this.setButton(check);
        this.setState({ profilefriend: profile });
        //await console.log(this.state.profilefriend);
    }

    onChangeText = (text) => {
        this.setState({ textSearch: text });
        // let profile = {
        //     imageUri: null,
        //     firstname: null,
        //     lastname: null,
        // };
        // this.setState({profilefriend:profile});
        //console.log(this.state.profile);
    }

    onCancel = () => {
        this.setState({ onfocus: false });
        this.inputRefs.focusSearch.current.blur();
        this.inputRefs.focusSearch.current.clear();
        let profile = {
            imageUri: null,
            firstname: null,
            lastname: null,
            id: null
        };
        this.setState({ profilefriend: profile });
        this.setState({ textSearch: null });
    }

    onAddFriend = async () => {
        this.setState({ spinner: true });
        await fire_base.addFriend(this.props.id, this.state.profilefriend.id, this.addFriendSuccess, this.unsuccess)
    }

    addFriendSuccess = async () => {
        await fire_base.addFriend(this.state.profilefriend.id, this.props.id, this.addAllSuccess, this.unsuccess)
    }

    addAllSuccess = () => {
        this.setButton(false);

    }

    unsuccess = (error) => {
        console.log(error);
        this.setState({ spinner: false });
    }

    setButton = (state) => {
        if (state) {
            this.setState({ colorButtonAdd: '#eba966' });
            this.setState({ buttonDisable: false });
        } else {
            this.setState({ colorButtonAdd: 'gray' });
            this.setState({ buttonDisable: true });
        }
    }

    onChat = () => {
        //console.log(this.state.selectprofile);
        this.closePanel();
        this.navigation.navigate('Chat', { sender: this.props.id, profileFriend: this.state.selectprofile })
    }

    onUnfriend = () => {
        Alert.alert(
            "",
            'Are you sure you want to remove "' + this.state.selectprofile.firstname
            + ' ' + this.state.selectprofile.lastname + '" as your friend?',
            [
                { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
                { text: "Confirm", onPress: () => this.confirmUnfriend() },
            ],
            { cancelable: false }
        );
    }

    confirmUnfriend = async () => {
        this.setState({ spinner: true });
        await fire_base.unFriend(this.props.id, this.state.selectprofile.id, this.unFriendSuccess, this.unsuccess);
    }

    unFriendSuccess = async () => {
        await fire_base.unFriend(this.state.selectprofile.id, this.props.id, this.unAllFriendSuccess, this.unsuccess);
    }

    unAllFriendSuccess = async () => {
        this.closePanel();
    }

    renderHeader = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ paddingLeft: 10, color: 'gray' }}>friends {this.state.countfrienduser}</Text>
            </View>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: "#dddddd",
                }}
            />
        );
    };

    renderItem = ({ item }) => {
        return (

            <TouchableOpacity style={{ backgroundColor: "white", height: 80 }} onPress={() => this.openPanel(item)} >

                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 10 }}>
                    <Image source={{ uri: item.imageUri }} style={{ height: 60, width: 60, borderRadius: 50 }} />
                    {/* <View style={{ height: 60, width: 60, backgroundColor: 'skyblue', borderRadius: 50 }} /> */}
                    <View style={{ paddingLeft: 8, flex: 1 }}>
                        {/* <Text style={{ fontSize: 18 }}>{item.username}</Text> */}
                        <Text style={{ fontSize: 18 }}>{item.firstname + ' ' + item.lastname}</Text>
                    </View>
                </View>

            </TouchableOpacity>

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
                    {this.state.onfocus && (
                        <TouchableOpacity onPress={this.onCancel}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    )}
                    {!this.state.onfocus && (
                        <Text style={{ fontSize: 26, color: '#ce7870' }}>VOCH</Text>
                    )}
                    <View style={styles.viewSearch}>
                        <TextInput placeholder='Search Voch ID'
                            style={styles.textInputSearch}
                            onFocus={() => this.setState({ onfocus: true })}
                            //onEndEditing={() => this.setState({ onfocus: false })}
                            onChangeText={(text) => { this.onChangeText(text) }}
                            ref={this.inputRefs.focusSearch} />
                        <TouchableOpacity onPress={this.onSearch}>
                            <EvilIcons name="search" size={24} color="gray" style={{ paddingRight: 8, paddingLeft: 5 }} />
                        </TouchableOpacity>
                    </View>

                </View>
                {this.state.onfocus && (
                    <View style={styles.viewProfile}>
                        <View style={{ height: 300, width: 300, flexDirection: 'column', alignItems: 'center' }}>
                            <Image source={{ uri: this.state.profilefriend.imageUri }} style={{
                                height: 140,
                                width: 140,
                                borderRadius: 100,
                                resizeMode: 'cover',
                            }} />
                            <Text style={{ margin: 10, marginBottom: 15, fontWeight: 'bold', fontSize: 20 }}>{this.state.profilefriend.firstname}</Text>
                            {this.state.profilefriend.id != null && this.state.profilefriend.id != this.props.id && (
                                <TouchableOpacity style={{ backgroundColor: this.state.colorButtonAdd, justifyContent: 'center', borderRadius: 5 }}
                                    onPress={this.onAddFriend}
                                    disabled={this.state.buttonDisable}>
                                    <Text style={{ fontSize: 18, margin: 5, color: 'white' }}>Add Friend</Text>
                                </TouchableOpacity>
                            )}

                        </View>
                    </View>
                )}

                {!this.state.onfocus && (


                    <FlatList
                        data={this.state.friends}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                    />

                )}

                <SwipeablePanel isActive={this.state.swipeablePanelActive}
                    onClose={() => this.closePanel()}
                    fullWidth={true}
                    showCloseButton={true}
                    style={{ flexDirection: 'column', padding: 10 }}
                    onlySmall={true}
                    >
                    <View style={{ backgroundColor: '#ecbcb0', height: 100, borderTopRightRadius: 20, borderTopLeftRadius: 20 }} />

                    <View style={{ flexDirection: 'row', height: 60, backgroundColor: 'white' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: '#6e7d75', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 15,width:80 }} onPress={this.onChat}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Chat</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Image source={{ uri: this.state.selectprofile.imageUri }} style={{ height: 120, width: 120, borderRadius: 60, position: 'absolute', bottom: 3 }} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                            <TouchableOpacity style={{ backgroundColor: '#ce7870', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 15,width:80 }} onPress={this.onUnfriend}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Unfriend</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.selectprofile.firstname} {this.state.selectprofile.lastname}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: 'lightgray' }}>
                            <Text style={{ color: 'gray' }}>Friend</Text>
                            <Text style={{ fontSize: 18, color: 'gray' }}>{this.state.countfriend}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: 'gray' }}>Poll</Text>
                            <Text style={{ fontSize: 18, color: 'gray' }}>{this.state.countpoll}</Text>
                        </View>
                    </View>




                </SwipeablePanel>


                <StatusBar style='dark' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //backgroundColor: '#becbcf'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 85,
        borderBottomWidth: 1,
        borderColor: '#C1C1C1',
        paddingTop: Constants.statusBarHeight,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        justifyContent: 'flex-end'
        //alignItems: 'center'
    },
    viewSearch: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        height: 35,
        marginLeft: 10,
        borderColor: 'gray',
        flexDirection: 'row',
        alignItems: 'center',

    },
    textInputSearch: {
        flex: 1,
        paddingStart: 8,
        borderRightWidth: 1,
        borderRightColor: 'gray'
    },
    viewProfile: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
});

const mapDispatchToProps = (dispatch) => {
    return {
        add: (payload) => dispatch(addFriend(payload))
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profileReducer.profile,
        id: state.profileReducer.id,
        polls: state.profileReducer.polls
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friend);