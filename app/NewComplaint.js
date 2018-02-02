import React, { Component } from 'react';
import {
    StyleSheet,
    NativeModules,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Dimensions,
    Picker,
    TextInput,
    Alert,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';

import {
    Button,
    Card,
    FormLabel,
    FormInput,
    FormValidationMessage,
    Text,
    Divider
} from 'react-native-elements';

import MapView from 'react-native-maps';
import SlideMenuButton from './components/SlideMenuButton';
import ImagePicker from 'react-native-image-crop-picker';
var FileUpload = require('NativeModules').FileUpload;
import CategoriesPicker from './components/CategoriesPicker';

import { CreateFD } from './utils/Rest';

var _ = require('lodash');

const { screenHeight, screenWidth } = Dimensions.get('window');

export default class ComplaintForm extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: "New Complaint",
            drawerLabel: 'New Complaint',
            headerRight: <Button
                onPress={() => params.onSaveClick()}
                transparent
                color="black"
                buttonStyle={{ borderRadius: 50, paddingRight: 20, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                title='SAVE'
            />
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            coords: {
                latitude: 45.751028,
                longitude: 21.226335,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            pictures: [],
            description: '',
            category: 'none',
            isLoading: false
        }
    }

    categoryChange(el) {
        this.setState({
            category: el
        });
    }

    validate() {
        let me = this;
        let errorMessage = '';

        if (me.state.description.length < 40) {
            errorMessage = errorMessage.concat('\n Description must be at least 40 caracters.')
        }
        if (me.state.category == 'none') {
            errorMessage = errorMessage.concat('\n Please select a category.')
        }

        if (errorMessage.length == 0) {
            return true;
        }

        Alert.alert(
            'Invalid form',
            errorMessage,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
        )

        return false;

    }

    onSaveClick() {
        let me = this;

        if (me.validate()) {

            me.setState({
                isLoading: true
            });

            const form = new FormData();
            let files = this.state.pictures.map(function (pic, idx) {
                let pathSplitted = pic.path.split("/");
                let filename = pathSplitted[pathSplitted.length - 1].split('.');
                form.append('image_' + idx, {
                    uri: pic.path,
                    type: pic.mime,
                    name: pathSplitted[pathSplitted.length - 1],
                });
                return;
            });
            form.append("uid", global.user.id);
            form.append("location", me.state.coords.latitude + ',' + me.state.coords.longitude);
            form.append("category_id", me.state.category);
            form.append("description", me.state.description);

            CreateFD('complaint', form).then(function (res) {
                return res.json();
            })
                .then(function (resJson) {
                    me.setState({
                        isLoading: false
                    });
                    if(resJson.id){
                        ToastAndroid.showWithGravity('We received your complaint. Our team will take all the measures to find solutions quickly. \n Thank you for being an active citizen!', ToastAndroid.LONG, ToastAndroid.CENTER);
                        me.props.navigation.goBack();
                    } else {
                        ToastAndroid.showWithGravity('SERVER ERROR', ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                })
                .catch(function (error) {
                    me.setState({
                        isLoading: false
                    });
                    ToastAndroid.showWithGravity('SERVER ERROR \n '+ error.message, ToastAndroid.LONG, ToastAndroid.CENTER);
                    throw error;
                }).done();

        }

    }

    openImageBrowser() {
        let me = this;
        ImagePicker.openPicker({
            multiple: true
        }).then(pictures => {
            me.selectPictures(pictures);
        });
    }

    selectPictures(newPictures) {
        let me = this;
        let picArr = me.state.pictures;
        _.forEach(newPictures, function(pic) {
            if(_.find(picArr, { 'path': pic.path }) == undefined){
                picArr.push(pic);
            }
        });
        me.setState({
            pictures: picArr
        });

    }

    openCamera() {
        let me = this;
        ImagePicker.openCamera({
            cropping: true,
            enableRotationGesture: true
        }).then(pic => {
            let picArr = me.state.pictures;
            picArr.push(pic);
            me.setState({
                pictures:picArr
            });
        });
    }

    componentDidMount() {
        let me = this;
        this.props.navigation.setParams({ onSaveClick: this.onSaveClick.bind(this) });

        navigator.geolocation.getCurrentPosition(
            (res) => {
                this.setState({
                    coords: {
                        latitude: res.coords.latitude,
                        longitude: res.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }
                });
            },
            (err) => {
                console.log(err);
            }
        );
    }

    deselectPicture(pic) {
        let newArr = this.state.pictures.filter(_pic => _pic !== pic);
        this.setState({
            pictures: newArr
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        let form = (

            <ScrollView>

                <MapView
                    style={{ flex: 1, height: 200 }}
                    initialRegion={this.state.coords}
                >
                    <MapView.Marker
                        coordinate={this.state.coords}
                        title={"You"}
                        description={"This is where you are"}
                    />
                </MapView>

                <View style={styles.wrapper}>
                    <CategoriesPicker value={this.state.category} categoryChange={this.categoryChange.bind(this)} />
                </View>


                <View style={styles.wrapper}>
                    <Text>Description</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        onChangeText={(text) => this.setState({ description: text })}
                        value={this.state.description}
                    />
                </View>

                <View style={styles.wrapper}>

                    <Text style={{ paddingBottom: 5 }}>Add Pictures:</Text>

                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {this.state.pictures.map((picture) => {
                            return (
                                <TouchableOpacity buttonStyle={styles.thumbnail} onPress={() => this.deselectPicture(picture)}>
                                    <Image style={styles.thumbnail} key={_generateUUID()} source={{ uri: picture.path }} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    <View style={styles.buttonsWrap}>
                        <Button
                            icon={{ name: 'camera-enhance' }}
                            iconRight
                            backgroundColor='#70278D'
                            onPress={this.openCamera.bind(this)}
                            buttonStyle={{ borderRadius: 50, paddingRight: 20, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                        />
                        <Button
                            icon={{ name: 'folder' }}
                            iconRight
                            backgroundColor='#70278D'
                            onPress={this.openImageBrowser.bind(this)}
                            buttonStyle={{ borderRadius: 50, paddingRight: 20, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                        />

                    </View>


                </View>

            </ScrollView>

        );

        let loader = (
            <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#70278D" size={70} />
            </View>
        );



        return (
            <View style={styles.screenContainer}>
                {this.state.isLoading ? loader : form}
            </View>
        );
    }

}

function _generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        margin: 5
    },
    screenContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    buttonsWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center'
    },
    thumbnail: {
        width: 73,
        height: 73,
        borderWidth: 1,
        borderColor: '#DDD',
        margin: 5,
    },
});