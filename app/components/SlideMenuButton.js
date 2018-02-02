
import React, { Component } from 'react';

import { Icon } from 'react-native-elements'

import { TouchableOpacity } from 'react-native';

export default class SlideMenuButton extends Component {
    render(){
        return(
            <TouchableOpacity activeOpacity={.5} onPress={this.props.onPress} style={{marginLeft:10}}>
                <Icon  name="menu"/>
            </TouchableOpacity>
        );
    }
}