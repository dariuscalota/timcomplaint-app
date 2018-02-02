
import React, { Component } from 'react';

import { Picker, View, StyleSheet } from 'react-native';

import { List } from '../utils/Rest';

export default class CategoriesPicker extends Component{

    constructor(props){
        super(props);
        this.state = {
            enabled: false,
            categories: []
        };
    }

    componentDidMount() {
        var me = this;
        List('category')
            .then(function(res){
                return res.json();
            })
            .then(function(resJson){
                me.setState({
                    categories: resJson.records,
                    enabled: true
                });
                console.log(resJson);
            })
            .catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
        }).done();
    }

    render() {
        return (
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={this.props.value}
                    enabled={this.state.enabled}
                    onValueChange={this.props.categoryChange}
                    style={styles.picker}
                >
                    <Picker.Item label="select category" value="none" />
                    {this.state.categories.map((category) => {
                        return (
                            <Picker.Item style={styles.pickerItem} label={category.name} value={category.id} />
                        )
                    })}
                </Picker>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    pickerWrapper: {
        backgroundColor: '#70278D'
    },
    picker: { 
        marginLeft: 15, 
        marginRight: 15, 
        color:'white', 
        borderWidth: 0.3, 
        borderColor:'white'
    }
});
