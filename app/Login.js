import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    AsyncStorage,
    ActivityIndicator,
    NetInfo,
    Alert
} from 'react-native';

//a component that checks automatically if location is enabled and if not, it prompts a dialog
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

//a componente that we use to show an error message under the field that is not valid
import { FormValidationMessage } from 'react-native-elements';

//from react-navigation documentation, this object that we import is necessary
//in order to reset the navigation history
import { NavigationActions } from 'react-navigation';

import { CreateJSON } from './utils/Rest';

//background source
const background = require("../assets/images/timisoara-bg.jpg");

//logo source
const logo = require("../assets/images/logo-timcomplaint.png");

//icons sources
const personIcon = require("../assets/icons/user.png");
const emailIcon = require("../assets/icons/email.png");
const phoneIcon = require("../assets/icons/phone.png");



export default class Login extends Component {

    //this object is defined at the beginning of every component that takes part of a naviagtor component
    //however it is not mandatory, we use it many times in our app to define the header bar
    //for every screen, and also we can define here the title in the menu
    static navigationOptions = {
        header: null
    };

    //the constructor method is used mainly to define the initial state of the application
    //constructor is called before componentDidMount and also before render
    //this method is also not mandatory
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            name: '',
            nameError: '',
            email: '',
            emailError: '',
            phone: '',
            phoneError: '',
            isLoading: true,
            initialPosition: 'unknown'
        };
    }

    //also as the documentation says, this method is the best place to handle asynchronous jobs
    //ex: login,get a list of data, etc

    componentDidMount() {
        let me = this;

        const { navigate } = this.props.navigation;

        //here we check wether the user is connected to the internet or not
        NetInfo.isConnected.fetch().then(
            isConnected => {

                //if the user is connected to internet we check for location
                if (isConnected) {
                    LocationServicesDialogBox.checkLocationServicesIsEnabled({
                        message: "<h2>Use Location ?</h2>In order to work this app needs to know your location:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/>",
                        ok: "YES",
                        cancel: "NO"
                    }).then(function (success) {

                        navigator.geolocation.getCurrentPosition((position) => {

                            let initialPosition = JSON.stringify(position);

                            // if the user has inteernet and also location
                            // we can proceed to checking if the user is already existing
                            // in our phone's sql database

                            me.checkExistingUser().then(res => {


                                if (res) {

                                    //if user is found,we set our global variable user for later use in our app
                                    global.user = JSON.parse(res);

                                    //by default react-navigation keeps a history of routes visited before, so that when the user
                                    //clicks back, it goes automatically to the last route
                                    //we need to prevent the user coming back after clicking the save details button
                                    this.props.navigation.dispatch(NavigationActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({ routeName: 'Main' })
                                        ]
                                    }));

                                } else {
                                    //if there is no existent user in local SQL DB, then show the form 
                                    //and let people create one
                                    me.setState({
                                        initialPosition,
                                        isLoading: false
                                    });
                                }
                            });
                            //some error handling
                        }, error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
                    }.bind(this)
                        ).catch((error) => {
                            console.log(error.message);
                        });

                } else {
                    //if the user is not connected to the internet we show an alert message
                    Alert.alert(
                        'Internet error',
                        'In order to use this application you need to connect to the Internet. Please connect to the internet and open the application again. Thank you!',
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') }
                        ],
                        { cancelable: false }
                    )
                }

            }
        );
    }

    //asynchronous function that checks if user exists in the SQL database of our phone
    //using AsyncStorage component from react-native
    //AsyncStorage accespts only values in form "key":"value"
    async checkExistingUser() {
        const userDetails = await AsyncStorage.getItem('userDetails').catch(error => error);
        return userDetails;
    }

    //asynchronous function that saves an user in the SQL database of our phone 
    //using AsyncStorage component from react-native
    async saveUserLocal(user) {
        const userDetails = await AsyncStorage.setItem('userDetails', JSON.stringify(user)).catch(error => error);
        return userDetails;
    }



   //this function is called after user clicked on submit button and the form is valid
    onSubmit() {
        const { navigate } = this.props.navigation;
        let me = this;

        //first we set the state of the form to isLoading
        //this action will force the view to re-render, and will show our loader component
        this.setState({
            isLoading: true
        });

        //after, we make a POST request to the api user/create.php
        //with the form values as seen below
        CreateJSON(
            'user', // <-- api name (for more details look into the definition)
            { // <-- we take the form values from the state
                'name': me.state.name,
                'email': me.state.email,
                'phone': me.state.phone
            })
            .then(function (res) { //when receiving an answer from server this function is called
                return res.json(); //we process the answer and transform it from string to JSON
            })//return of the result is continuing execution, so the next "then" function is called with the values returned from the first one
            .then(function (resJson) {
                let usr = {
                    id: resJson.id,
                    name: me.state.name,
                    email: me.state.email,
                    phone: me.state.phone
                };
                //setting the user variable in our global scope
                //and saving also the user in our local SQL DB
                global.user = usr;
                me.saveUserLocal(usr).then(res => {
                    //if the saving in our local database succeeds then we navigate to the main screen
                    navigate('Main');
                });
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
            }).done();

    }

    //this function is constantly invoked after every cahnge in any field
    checkValidity() {
        if (this.state.nameError.length == 0 &&
            this.state.emailError.length == 0 &&
            this.state.phoneError.length == 0 &&
            this.state.name.length > 0 &&
            this.state.email.length > 0 &&
            this.state.phone.length > 0
        ) {
            this.setState({
                isValid: true
            });
        } else {
            this.setState({
                isValid: false
            });
        }
    }

    onChangeName(name) {
        let errorMessage = '', me = this;
        if (name.length > 5) {
            errorMessage = '';
        } else if (name.length == 0) {
            errorMessage = 'Name is required.';
        } else {
            errorMessage = 'Name must be longer than 5 characters.';
        }

        this.setState({
            name: name,
            nameError: errorMessage
        }, me.checkValidity)
    }

    onChangeEmail(email) {
        let errorMessage = '', me = this;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.length == 0) {
            errorMessage = 'Email is required.';
        } else if (re.test(email)) {
            errorMessage = '';
        } else {
            errorMessage = 'Email is not valid.';
        }

        this.setState({
            email: email,
            emailError: errorMessage
        }, me.checkValidity);

    }

    onChangePhone(phone) {
        let errorMessage = '', me = this;
        let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (phone.length == 0) {
            errorMessage = 'Phone number is required.';
        } else if (re.test(phone)) {
            errorMessage = '';
        } else {
            errorMessage = 'Phone number is not valid.';
        }

        this.setState({
            phone: phone,
            phoneError: errorMessage
        }, me.checkValidity);
    }

    //render function is called everytime the state of our app changes
    //here we declare the UI based on our state variables
    //before return we can declare other components and use them in the return expression
    render() {
        let valid = this.state.isValid;

        let loader = (
            <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#70278D" size={70} />
            </View>
        );


        let form = (
            <View style={styles.container}>
                <View style={styles.container} />

                <View style={styles.wrapper}>

                    <View style={styles.logoWrap}>
                        <Image
                            source={logo}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image
                                source={personIcon}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                        <TextInput
                            placeholder="Full Name"
                            keyboardType="default"
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            ref={(el) => { this.name = el; }}
                            onChangeText={this.onChangeName.bind(this)}
                            value={this.state.name}
                        />
                    </View>
                    {this.state.nameError.length > 0 ? <FormValidationMessage style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}>{this.state.nameError}</FormValidationMessage> : <View />}

                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image
                                source={emailIcon}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                        <TextInput
                            placeholder="Email"
                            keyboardType="email-address"
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            ref={(el) => { this.email = el; }}
                            onChangeText={this.onChangeEmail.bind(this)}
                            value={this.state.email}
                        />
                    </View>
                    {this.state.emailError.length > 0 ? <FormValidationMessage style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}>{this.state.emailError}</FormValidationMessage> : <View />}


                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image
                                source={phoneIcon}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                        <TextInput
                            placeholder="Phone"
                            keyboardType="phone-pad"
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            ref={(el) => { this.phone = el; }}
                            onChangeText={this.onChangePhone.bind(this)}
                            value={this.state.phone}
                        />
                    </View>
                    {this.state.phoneError.length > 0 ? <FormValidationMessage style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}>{this.state.phoneError}</FormValidationMessage> : <View />}

                    <TouchableOpacity
                        activeOpacity={.5}
                        disabled={!valid}
                        onPress={this.onSubmit.bind(this)}
                    >
                        <View style={valid ? styles.button : styles.buttonDisabled}>
                            <Text style={styles.buttonText}>Save</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={styles.container} />

            </View>
        );

        return (
            <Image
                style={[styles.background, styles.container]}
                source={background}
                resizeMode="cover"
            >

                {this.state.isLoading ? loader : form}

            </Image>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        width: null,
        height: null,
    },
    wrapper: {
        paddingHorizontal: 15
    },
    inputWrap: {
        flexDirection: "row",
        marginVertical: 5,
        height: 40,
        backgroundColor: "transparent"
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#FFF'
    },
    iconWrap: {
        paddingHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#70278D"
    },
    icon: {
        width: 20,
        height: 20
    },
    logoWrap: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    logo: {
        height: 120
    },
    button: {
        backgroundColor: "#70278D",
        paddingVertical: 15,
        marginVertical: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: "#70278D",
        paddingVertical: 15,
        marginVertical: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18
    },

});

// AppRegistry.registerComponent('login', () => screens);