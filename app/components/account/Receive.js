/**
 *  transfer receive code generate
 * @author hjn
 */

import React, {Component} from 'react';
import QRCode from 'react-native-qrcode'
import {Button, StyleSheet, Text, View} from 'react-native';
export default class ReceivePage extends Component<>{
    static navigationOptions = {
        title: 'Receive',
    };

    constructor(props) {
        super(props);
        this.state = {
            account: 'ayiuivl52fnq',
        };
    }

    componentDidMount() {


    }

    render() {
        const account = this.props.navigation.getParam('account');

        return (
            <View style={styles.container}>
                <Text style={styles.text}>{account}</Text>
                <QRCode value={account}
                size={200}
                bgColor='purple'
                fgColor='white'/>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        flexDirection: 'column'
    },
    text: {
        color: '#2a2a2a',
        fontSize: 20,
        textAlign: 'center',
        margin: 30,
    },
});