import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet,Button,TextInput, Text, View,Alert, Modal,FlatList} from 'react-native';
// import { Input } from 'native-base';
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import {createDrawerNavigator} from 'react-navigation-drawer'
import {createStackNavigator} from 'react-navigation-stack'
import {createBottomTabNavigator} from 'react-navigation-tabs'

import {MaterialIcons} from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'; 

import firebase from 'firebase'
import {firebaseConfig} from './config'
// import * as firebaseobj from 'firebase'
// import * as firebase from 'firebase/app'

import SignupScreen from './screens/signup';
import SigninScreen from './screens/signin';
import LoadingScreen from './screens/loadingscreen';

if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

class App extends React.Component {
  constructor(){
    super();
    this.state={
      text:'',
      email:'',
      list:[],
    }
  }
  componentDidMount(){
    // const myusers = firebase.database().ref("users");
    // myusers.on("value",datasnap=>{
    //   console.log(datasnap.val())
    // })
    // const dept = firebase.database().ref("dept");
    // dept.set({
    //   deptid:3,
    //   deptname:"CS",
    // })
    // =====================================================
    // const myusers = firebase.database().ref("dept");
    // myusers.on("value",datasnap=>{
    //   console.log(Object.values(datasnap.val()))
    // })
    // const dept = firebase.database().ref("dept");
    // dept.push().set({
    //   deptid:4,
    //   deptname:"CS",
    // })
    // =====================================================
  this.unsuscribeAuth = firebase.auth().onAuthStateChanged(user=>{
    if (user){
      this.setState({email:user.email})
    }else{
      this.props.navigation.navigate('Signin')
    }
  })
    // =====================================================
  const myusers = firebase.database().ref("dept");
  myusers.on("value",datasnap=>{
    if(datasnap.val()){
      console.log("------",datasnap.val())
      this.setState( {list:datasnap.val()} )
      }
    })
  }

  componentWillUnmount(){
    this.unsuscribeAuth()
  }

  userSignout(){
    firebase.auth().signOut()
    .catch(error=>{
      Alert.alert(error.message)
    })
  }

  saveitem(){
    // console.log(this.state.text)
    const myusers = firebase.database().ref("dept");
    // myusers.push().set({
    myusers.push({
      // console.log(Object.values(datasnap.val()))
      // todoList.push({ id, ...todos[id] });
      text:this.state.text,
    })  
    this.setState({text:''})
  }
  deleteallitem(){
    // console.log(this.state.text)
    firebase.database().ref("dept").remove();
    this.setState({list:''})
  }

  deleteitem = (item) => {
    console.log(item)
    
    var db = firebase.database().ref();
    var query = firebase.database().ref("dept").orderByKey();
    query.once("value")
      .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var pkey = childSnapshot.key; 
        var chval = childSnapshot.val();
        console.log(pkey)
        console.log(chval)
        console.log('+++++++++',this.state.list)
        //check if remove this child
        if(chval.text==item.text){
          console.log('inside')
          db.child("dept/"+pkey).remove();
          return true;
        }

      });
    });
  }

  updateitem = (item) => {
    console.log('\n')
    // console.log(item)

    var db = firebase.database().ref();
    var query = firebase.database().ref("dept").orderByKey();

    // var a = firebase.database().ref("dept").child('' + item.text)
    // // console.log(a)
    // console.log(a.key)
    // // console.log(a.id)

    query.once("value")
      .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var pkey = childSnapshot.key; 
        var chval = childSnapshot.val();
        console.log(pkey)
        // console.log(chval)

        //check if remove this child
        // if(chval.text){
          // db.child("dept/"+pkey).remove();
          return true;
        // }

      });
    });



    // firebase.database().ref("dept").update({
    //   text:"rameez"
    // });

    // var db = firebase.database().ref();
    // var query = firebase.database().ref("dept").orderByKey();
    // query.once("value")
    //   .then(function(snapshot) {
    //   snapshot.forEach(function(childSnapshot) {
    //     var pkey = childSnapshot.key; 
    //     var chval = childSnapshot.val();

    //       db.child("dept/"+pkey).update({
    //           text:"rameez"
    //         });
    //         return true;

    //   });
    // });

  }

  render() {
    // const myitems = this.state.list
    // console.log(this.state.list)

    return(
      <View>

        <View style={styles.container}>
          <Text Button onPress={()=>{this.props.navigation.navigate('Profile')}}>Go to Profile</Text>
          <Text style={{fontSize:20}}>Welcome, {this.state.email}</Text>
          <Button color="blue" onPress={()=>{this.userSignout()}} title="Logout"/>
        </View>
        
        <View style={styles.textinput}>
          <TextInput 
          style={styles.textinput1}
          placeholder="Enter Text"
          value={this.state.text}
          onChangeText={(text)=>this.setState({text})}
          />
          <View style={{flex:1,flexDirection:"row",justifyContent:'center',alignItems:'center',margin:5,}}>
            <Button 
            color='blue'
            onPress={()=>this.saveitem()}
            title="Add"
            />
            <Button 
            color='#f70505'
            onPress={()=>this.deleteallitem()}
            title="Delete All"
            />
          </View>
        </View>

        <View style={styles.list}>
          <Text style={{fontSize:25,paddingLeft:10,}}>List</Text>
          
          <FlatList
          style={{padding:10}}
          data={Oject.values(this.state.list)}
          // keyExtractor={item => console.log(item.text)}
          // keyExtractor={item => item.text}
          // keyExtractor={(item) => `${item.id}`} 
          // keyExtractor={(item) => item.id}
          renderItem={({item})=>(
          //if (this.state.list.length){
          //console.log('=====',{value:Object.values(item),key:Object.keys(item)})
          console.log("9999")
          //let item =   Object.values(item)[0]
          // return(
          // <Text style={styles.listitem}>
          
          // {item.text}
          // <Text style={{margin:2,padding:2,backgroundColor:"#000",color:"#fff"}} onPress={()=>this.updateitem(item)}>Update</Text>
          // <Text style={{margin:2,padding:2,backgroundColor:"#000",color:"#fff"}} onPress={()=>this.deleteitem(item)}>Delete</Text>
          
          // </Text>
          // )
      //  }
      )}

          />
        </View>

        </View>
    );
  };
}
function Profile(props){

  return(
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button onPress={()=>{props.navigation.navigate('Home')}} title="Go to Home"/>
    </View>
  )
}

// const appNavigator = createStackNavigator({
//   Signup:{
//     screen:SignupScreen,
//   },
//   Signin:{
//     screen:SigninScreen,
//   },
// })

const myswitch = createSwitchNavigator({
  LoadingScreen:{
    screen:LoadingScreen,
  },
  Home:{
    screen:App,
  },
  Profile:{
    screen:Profile,
  },
  stack:createStackNavigator({
    Signup:{
      screen:SignupScreen,
    },
    Signin:{
      screen:SigninScreen,
    },
  }),
})

export default createAppContainer(myswitch);


const styles = StyleSheet.create({
  textinput: {
    flex: 1,
    height:10,
    margin:10,
    padding:5,
    backgroundColor: '#c9c9c9',
  },
  textinput1: {
    flex: 1,
    height:10,
    margin:10,
    padding:5,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  list: {
    margin:10,
    padding:10,
    backgroundColor: '#ebebeb',
  },
  listitem: {
    padding:5,
    margin:5,
    backgroundColor:'#dedede',
  }
});
