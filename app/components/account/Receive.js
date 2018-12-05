/**
 *  transfer receive code generate
 * @author hjn
 */

import React, {Component} from 'react';
import QRCode from 'react-native-qrcode'
import {StyleSheet, Text, View} from 'react-native';

export default class ReceivePage extends Component<> {
    static navigationOptions = {
        title: 'Receive',
    };

    constructor(props) {
        super(props);
        this.state = {
            account: '',
        };
    }

    componentDidMount() {
        storage.load({
            key: 'defaultAccount'
        }).then(res => {
            this.setState({account: res})
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.state.account}</Text>
                <QRCode value={"receive://"+this.state.account}
                        size={200}
                        bgColor='purple'
                        fgColor='white'/>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    text: {
        color: '#2a2a2a',
        fontSize: 20,
        textAlign: 'center',
        margin: 30,
    },
});