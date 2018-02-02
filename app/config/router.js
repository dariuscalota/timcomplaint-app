//in this file we define our most important component, the router
//the router is also the hardest part to implement in an react-native part
//the router is playing an important part in our app's architecture

//our job got easier using the react-navigation component

//for our app we use a StackNavigator(multiple windows stacked one on top of the other)
// and a DrawerNavigator(sidebar navigator)

//the documentation from react-navigation is quite complete so more relevant information
//about how it works we can find there

import React from 'react';
import { DrawerNavigator, StackNavigator, DrawerItems } from 'react-navigation';

import { ScrollView } from 'react-native';

//the difference between a view and a scrollview is simple:
//in a view you can not scroll through the content
//in a scrollview we usually put things like lists, forms and others which occupy 
//more space

import Login from '../Login';
import MainScreen from '../MainScreen';
import NewComplaint from '../NewComplaint';
import MyComplaints from '../MyComplaints';
import MyDetails from '../MyDetails';
import Contact from '../Contact';
import ViewComplaint from '../ViewComplaint';



export const Main = DrawerNavigator({
    Home: {
        screen: MainScreen
    },
    MyComplaints: {
        screen: MyComplaints
    },
    MyDetails: {
        screen: MyDetails
    },
    Contact: {
        screen: Contact
    }
},{
    drawerWidth: 250,
    contentComponent: props => <ScrollView><DrawerItems {...props} /></ScrollView>
});

export const Root = StackNavigator({
    Login: {
        screen: Login
    },
    Main: {
        screen: Main
    },
    NewComplaint: {
        screen: NewComplaint
    },
    ViewComplaint: {
        screen: ViewComplaint,
        navigationOptions: ({ navigation }) => ({
            title: `${navigation.state.params.description.toUpperCase()}`,
        })
    },
});