
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
    ActivityIndicator
} from 'react-native';

import {
    Icon,
    FormValidationMessage
} from 'react-native-elements';

import SlideMenuButton from './components/SlideMenuButton';

import { UpdateJSON } from './utils/Rest';

const personIcon = require("../assets/icons/user.png");
const emailIcon = require("../assets/icons/email.png");
const phoneIcon = require("../assets/icons/phone.png");


export default class MyDetails extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "My Details",
        drawerLabel: 'My Details',
        drawerIcon: <Icon name="account-circle" />,
        headerLeft: <SlideMenuButton onPress={() => navigation.navigate('DrawerOpen')} />,
    });

    constructor(props) {
        super(props);
        this.state = {
            isValid: true,
            name: global.user.name,
            nameError: '',
            email: global.user.email,
            emailError: '',
            phone: global.user.phone,
            phoneError: '',
            isLoading: false
        };
    }

    async saveUserLocal(user) {
        const userDetails = await AsyncStorage.setItem('userDetails', JSON.stringify(user)).catch(error => error);
        return userDetails;
    }

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

    onSubmit() {
        let me = this;

        this.setState({
            isLoading: true
        });

        UpdateJSON(
            'user',
            {
                'id':global.user.id,
                'name': me.state.name,
                'email': me.state.email,
                'phone': me.state.phone
            })
            .then(function (res) {
                return res.json();
            })
            .then(function (resJson) {
                if(resJson.success == false){
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    me.setState({
                        isLoading: false
                    });
                    return;
                }
                let usr = {
                    id: global.user.id,
                    name: me.state.name,
                    email: me.state.email,
                    phone: me.state.phone
                };
                me.saveUserLocal(usr).then(res => {
                    me.setState({
                        isLoading: false
                    });
                    global.user = usr;
                    ToastAndroid.showWithGravity('Your user details have been updated successfully!', ToastAndroid.LONG, ToastAndroid.CENTER);
                });
            })
            .catch(function (error) {
                me.setState({
                    isLoading: false
                });
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
            }).done();

    }

    render() {
        let valid = this.state.isValid;

        let loader = (
            <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#70278D" size={70} />
            </View>
        );


        let form = (

            <View style={styles.wrapper}>

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

                <View style={styles.container}/>

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

        );

        return (
            <View style={styles.container} >
                {this.state.isLoading ? loader : form}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
