
import React, { Component } from 'react';

import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity,
    Image
} from 'react-native';

import { Icon } from 'react-native-elements';

import SlideMenuButton from './components/SlideMenuButton';

import Communications from 'react-native-communications';

const mapPic = require("../assets/images/map.png");


export default class Contact extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Contact",
        drawerLabel: 'Contact',
        drawerIcon: <Icon name="phone" />,
        headerLeft: <SlideMenuButton onPress={() => navigation.navigate('DrawerOpen')} />,
    });

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => Communications.phonecall('0256-969', true)}>
                    <View style={styles.holder}>
                        <Text style={styles.text}>Call center: 0256-969</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Communications.phonecall('0256-969', true)}>
                    <View style={styles.holder}>
                        <Text style={styles.text}>Phone: 0256-408300</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Communications.email(['primariatm@primariatm.ro'],null,null,'Contact from app','Your message')}>
                    <View style={styles.holder}>
                        <Text style={styles.text}>Email: primariatm@primariatm.ro</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Communications.web('https://primariatm.ro')}>
                    <View style={styles.holder}>
                        <Text style={styles.text}>Website: primariatm.ro</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Communications.web('https://goo.gl/maps/AyvWWijGmkE2')}>
                    <View style={styles.mapHolder}>
                        <Text style={styles.text}>Bd. C.D. Loga, nr. 1, cod postal 300030</Text>
                        <Image
                            style={styles.mapImg} 
                            source={mapPic}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>
                

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    mapHolder: {
        flex:1,
        padding:10,
        margin:5,
        alignItems: 'center',
    },
    mapImg: {
        flex:1
    },
    holder: {
        padding:10,
        margin:5,
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
    },
});