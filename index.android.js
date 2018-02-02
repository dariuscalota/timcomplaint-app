/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

//this file is the point 0 of the application. Here you usually include the main component
//the main component can be a screen, or another react native component
//in our case, the main component is the react navigation object 


//STRUCTURE:
//imports are made at the beginning of every component
//using ctrl+click on the components we can navigate to their definitions
import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import './app/utils/Util.js';

import App from './app/App';


//the following line is a mandatory method
//you register your main component into the react native framework
//also with ctr+click you can go to its definition and read more
AppRegistry.registerComponent('TimComplaint', () => App);
