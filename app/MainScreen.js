import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

import {
    Button,
    Card,
    Icon
} from 'react-native-elements';

import SlideMenuButton from './components/SlideMenuButton';

const logo = require("../assets/images/logo-timcomplaint.png");

const AddButton = (props) => (
    <TouchableOpacity activeOpacity={.5} onPress={props.onPress} style={{ marginRight: 10 }}>
        <Icon name="add" />
    </TouchableOpacity>
);

export default class MainScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        drawerLabel: 'Home',
        title: 'TimComplaint',
        drawerIcon: <Icon name="home" />,
        headerLeft: <SlideMenuButton onPress={() => navigation.navigate('DrawerOpen')} />,
        headerRight: <AddButton onPress={() => navigation.navigate('NewComplaint')} />
    });

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Card
                        title='HAVE A PROBLEM?'
                        image={require('../assets/images/form.jpeg')}
                    >
                        <Text style={{ marginBottom: 10 }}>
                            The idea of this application is to provide you a fast way to report any problem regardin your city or community to the mayor of Timisoara city.
                        </Text>
                        <Button
                            icon={{ name: 'warning' }}
                            backgroundColor='#70278D'
                            onPress= {() => navigate("NewComplaint")}
                            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                            title='FILL A COMPLAINT'
                        />
                    </Card>
                    <Card
                        title='MORE'
                        image={require('../assets/images/timisoara-bg.jpg')}
                    >
                        <Text style={{ marginBottom: 10 }}>
                            DO you want to be a real citizen? Find out right now how you can help your local community.
                        </Text>
                        <Button
                            icon={{ name: 'remove-red-eye' }}
                            backgroundColor='#70278D'
                            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                            title='TELL ME MORE'
                        />
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});