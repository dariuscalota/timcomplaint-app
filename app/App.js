
//this file is the main component of our app, and that's a router from react-navigation
import React, { Component } from 'react';
import { Root, Main } from './config/router';

//all components in react native are extended from Component class of react
//this is also mandatory for all things we consider a react-native component in our app
class App extends Component {
  //besides the definition from documentation, there's nothing else more to say about render method
  //it is, again, mandatory and has to return always something
  //if we don't want to return anything, then we simply return an empty view component <View/>
  render() {
    return <Root />;
  }
}

//we can define multiple components in the same file and is not mandatory to export all of them
//in this case, of course we export de App component since we need it in the index.android.js
//but we could have also created multiple components here in the same file, use it alse here in the render method,
//and we didn't have to export them in order for our app to work

export default App;