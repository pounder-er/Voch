import * as firebase from 'firebase';
import 'firebase/auth';
import '@firebase/firestore';
import 'firebase/storage';
import { firebaseConfig } from './config';
class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        firebaseConfig
      });
    } else {
      console.log('firebase apps already running....');
    }
  }

  login = (email, password, success, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (data) {
        success(data);
      })
      .catch(function (error) {
        reject(error);
      });
  }

  getProfile(uid, success, reject) {
    firebase.firestore().collection('Profile')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        success(querySnapshot);
      })
      .catch((error) => {
        reject(error);
      });
  }

  getAllFriend(id, success, reject) {
    firebase.firestore().collection('Profile')
      .where('friends', 'array-contains', id)
      .get()
      .then(function (querySnapshot) {
        success(querySnapshot);
      })
      .catch(function (error) {
        reject(error);
      });
  }


  removePoll(idpoll, success, reject) {
    firebase.firestore().collection('Poll')
      .doc(idpoll).delete()
      .then(() => {
        success()
      })
      .catch((error) => {
        reject(error);
      })
  }



  getAllPoll = (friends, success, reject) => {
    firebase.firestore().collection('Poll')
      .where('iduser', 'in', friends).orderBy('date', 'desc')
      .get()
      .then((querySnapshot) => {
        success(querySnapshot);
      })
      .catch((error) => {
        reject(error);
      });

  }

  listeningPoll = (friends, success, reject) => {
    firebase.firestore().collection('Poll')
      .where('iduser', 'in', friends)
      .onSnapshot(function (querySnapshot) {
        success(querySnapshot);
      }, function (error) {
        reject(error);
      });
  }



  listeningProfileFriend(id, success, reject) {
    firebase.firestore().collection('Profile')
      .where('friends', 'array-contains', id)
      .onSnapshot(function (querySnapshot) {
        success(querySnapshot);
      }, function (error) {
        reject(error);
      });
  }

  checkVochId(vochid, success, reject) {
    firebase.firestore().collection('Profile')
      .where('vochid', '==', vochid)
      .get()
      .then((querySnapshot) => {
        success(querySnapshot);
      })
      .catch((error) => {
        reject(error);
      });
  }

  updateProfile(profile, id, success, reject) {
    firebase.firestore().collection('Profile')
      .doc(id)
      .update(profile)
      .then(() => {
        success();
      })
      .catch((error) => {
        reject(error);
      });
  }

  updateProfilePoll(profile, id, polls) {
    batch = firebase.firestore().batch();
    polls.forEach(element => {
      if (id == element.iduser) {
        let ref = firebase.firestore().collection("Poll").doc(element.id);
        batch.update(ref, profile);
      }
    });
    batch.commit().then(function () {
    });
  }

  setStatePoll = (idpoll, state, success, reject) => {
    firebase.firestore().collection('Poll')
      .doc(idpoll)
      .update({
        state: state
      })
      .then(() => {
        success();
      })
      .catch((error) => {
        reject(error);
      })
  }

  addFriend(id, idfriend, success, reject) {
    firebase.firestore().collection('Profile').doc(id)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(idfriend)
      })
      .then(() => {
        success();
      })
      .catch((error) => {
        reject(error);
      });
  }

  unFriend(id, idfriend, success, reject) {
    firebase.firestore().collection('Profile').doc(id)
      .update({
        friends: firebase.firestore.FieldValue.arrayRemove(idfriend)
      })
      .then(() => {
        success();
      })
      .catch((error) => {
        reject(error);
      });

  }

  listeningCurrentUser = (getSuccess) => {
    firebase.auth().onAuthStateChanged(function (user) {
      getSuccess(user);
    });
  }

  signOut = (success, reject) => {
    firebase.auth().signOut()
      .then(function () {
        success();
      })
      .catch(function (error) {
        reject(error);
      });
  }

  createUser = (email, password, success, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (data) {
        success(data);
      })
      .catch(function (error) {
        reject(error);
      });
  }

  uplaodToFirebase = async (uri, uid, success, reject) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child('profile/' + uid);
    ref
      .put(blob)
      .then(async (snapshot) => {
        await snapshot.ref.getDownloadURL().then((uri) => {
          success(uri);
        });
      })
      .catch((error) => {
        reject(error);
      });
  };

  addProfile(profile, success, reject) {
    profile.date = firebase.firestore.FieldValue.serverTimestamp();
    profile.friends = [];
    firebase.firestore().collection('Profile').add(profile)
      .then(function (docref) {
        success(docref);
      })
      .catch((error) => {
        reject(error);
      });
  }

  createPoll = (poll, success, reject) => {
    poll.date = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection('Poll').add(poll)
      .then((docref) => {
        success(docref);
      })
      .catch((error) => {
        reject(error);
      });
  }

  updatePoll = (idpoll, uservote, success, reject) => {
    let DocRef = firebase.firestore().collection('Poll').doc(idpoll);
    console.log('test')
    return firebase.firestore().runTransaction(function (transaction) {
      return transaction.get(DocRef).then(function (doc) {
        if (!doc.exists) {

        }
        console.log(doc.data());
        let newChoice = doc.data().choices;
        newChoice[uservote.choiceid - 1].votes += 1;

        let newUserVote = doc.data().uservote;
        newUserVote.push(uservote);


        transaction.update(DocRef, { choices: newChoice });
        transaction.update(DocRef, { uservote: newUserVote });

      })
    }).then(function () {
      success();
    }).catch(function (error) {
      reject(error);
    });
  }



  resetUser = (email, success, reject) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(function () {
        success();
      })
      .catch(function (error) {
        reject(error);
      });
  }


  sendMessage(message, success, reject) {
    message.date = firebase.firestore.FieldValue.serverTimestamp();
    firebase
      .firestore()
      .collection('Message')
      .add(message)
      .then(function (docRef) {
        success(docRef);
        //console.log(docRef.id);
      })
      .catch(function (error) {
        reject(error);
      });
  }

  getAllMessage(room, success, reject) {
    firebase
      .firestore()
      .collection('Message')
      .where('room', 'in', [room, [room[1], room[0]]]).orderBy('date')
      .get()
      .then(function (querySnapshot) {
        success(querySnapshot);
      })
      .catch(function (error) {
        reject(error);
      });
  }

  listeningMessage(room, success, reject) {
    firebase
      .firestore()
      .collection('Message')
      .where('room', 'in', [room, [room[1], room[0]]]).orderBy('date')
      .onSnapshot(function (snapshot) {
        success(snapshot);
        // snapshot.docChanges().forEach(function (change) {
        //   if (change.type === 'added') {
        //     success(change.doc);
        //   }
        // });
      }, function (error) {
        reject(error);
      });
  }





}
const fire_base = new Firebase();
export default fire_base;
