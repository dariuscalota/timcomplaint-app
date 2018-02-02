
import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

import { 
    List, 
    ListItem ,
    Icon,
    Text,
    Badge
} from 'react-native-elements';

import SlideMenuButton from './components/SlideMenuButton';

import {List as Get}  from './utils/Rest';

import moment from 'moment';

export default class MyComplaints extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "My Complaints",
        drawerLabel: 'My Complaints',
        drawerIcon: <Icon name="list" />,
        headerLeft: <SlideMenuButton onPress={() => navigation.navigate('DrawerOpen')} />,
    });

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            complaints: [],
            noComplaints: true
        }
    }

    onViewComplaint = (complaint) => {
        this.props.navigation.navigate('ViewComplaint', { ...complaint });
    };

    componentDidMount() {
        let me = this;
        Get('complaint',global.user.id)
            .then(function(res){
                return res.json();
            })
            .then(function(resJson){
                let response = (resJson.records) ? resJson.records :[];
                me.setState({
                    complaints: response,
                    isLoading: false
                });
                
                console.log(resJson);
            })
            .catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
        }).done();

    }
    
    render() {

        let loader = (
            <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#70278D" size={70} />
            </View>
        );

        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoading ? loader : <View/>}
                <List>
                    {this.state.complaints.length == 0 ? <Text>No available complaints</Text> : <View/>}
                    {this.state.complaints.map((complaint) => {
                            return (
                                <ListItem
                                    roundAvatar
                                    title={complaint.description}
                                    onPress={() => this.onViewComplaint(complaint)}
                                    subtitle={
                                        <View style={styles.subtitleView}>
                                            <Badge containerStyle={{ backgroundColor: '#70278D'}}>
                                                <Text style={styles.ratingText}>{moment(Date(complaint.created)).format('DD.MM.YYYY')}</Text>
                                            </Badge>
                                            <Badge containerStyle={{ marginLeft:5, backgroundColor: '#0077CC'}}>
                                                <Text style={styles.ratingText}>{complaint.category_name.toUpperCase()}</Text>
                                            </Badge>
                                        </View>
                                    }
                                    avatar={""}
                                />
                            )
                    })}
                    
                </List>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5
    },
    ratingText: {
        color: 'white'
    }
});