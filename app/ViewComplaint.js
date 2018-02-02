import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Image
} from 'react-native';

import { Badge, Text, FormLabel } from 'react-native-elements';

import { Get } from './utils/Rest';
import Carousel from 'react-native-carousel';

import moment from 'moment';

import { baseUrl } from './utils/Rest';

// const { screenHeight, screenWidth } = Dimensions.get('window');

export default class ViewComplaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            created: '',
            id: '',
            category: '',
            user_name: '',
            status: '',
            description: '',
            location: '',
            categories: '',
            pictures: []
        }
    }

    componentDidMount() {
        var me = this;
        Get('complaint', me.props.navigation.state.params.id)
            .then(function (res) {
                return res.json();
            })
            .then(function (resJson) {
                me.setState({
                    category: resJson.category_name,
                    user_name: resJson.user_name,
                    created: resJson.created,
                    status: resJson.status,
                    description: resJson.description,
                    location: resJson.location,
                    categories: resJson.records,
                    pictures: resJson.pictures ? resJson.pictures : [],
                    isLoading: false
                });
                console.log(resJson);
            })
            .catch(function (error) {
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

        let slider = (
            <Carousel animate={false} width={410}>
                {this.state.pictures.map((picture) => {
                    let imgUrl = baseUrl.concat('uploads/', picture.filename);
                    imgUrl.replace('http','https');
                    return (
                        <View style={styles.container}>
                            <Image
                                source={{uri: imgUrl}}
                                resizeMode="cover"
                                style={{width:410, height:400}}
                            />
                        </View>
                    );
                })}
            </Carousel>
        );

        let complaint = (
            <View style={{ flex: 1 }}>
                {this.state.pictures.length > 0 ? slider : <View />}

                <ScrollView style={{ flex: 1 }}>

                    <View style={{ alignItems: 'flex-end', padding: 10 }}>
                        <Text>{moment(Date(this.state.created)).format('DD.MM.YYYY')}</Text>
                    </View>

                    <View style={{ margin: 10 }}>
                        <FormLabel>Status: </FormLabel>
                        <Badge containerStyle={{ backgroundColor: 'red', margin: 10 }}>
                            <Text h4>{this.state.status}</Text>
                        </Badge>
                    </View>

                    <View style={{ margin: 10, backgroundColor: "white" }}>
                        <FormLabel>Category: </FormLabel>
                        <Text style={{ margin: 10 }}>{this.state.category}</Text>
                    </View>

                    <View style={{ margin: 10, backgroundColor: "white" }}>
                        <FormLabel>Description: </FormLabel>
                        <Text style={{ margin: 10 }}>{this.state.description}</Text>
                    </View>

                </ScrollView>
            </View>
        );

        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoading ? loader : complaint}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 410,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});