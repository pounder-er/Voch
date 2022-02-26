import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  View,StyleSheet,Image
} from 'react-native';

class Splash extends Component {
  constructor(props){
    super(props);
     this.state = {
 
    };
    const {navigation} = this.props;
    this.navigation = navigation;
  }

  componentDidMount() {
    setTimeout(()=>{
      this.props.navigation.navigate('Login');
      this.navigation.reset({index:0,routes:[{name:'Login'}]});
    },2000)      
  }


  render(props) {
    return (
      <View style={styles.container}>
       <Image source={require('./logo2.png')} style={styles.logo} />
        <StatusBar style='light' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6e7d75',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
      height: 132,
      width: 150
  }
});

export default Splash;