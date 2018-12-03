/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import Toast from "react-native-root-toast/lib/Toast";
import Loading from "./Loading";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});


export default class Account extends Component<> {
    static navigationOptions = {
        title: 'Create Account',
    };

    constructor(props) {
        super(props);
        this.state = {
            account: 'houjingna113',loading:false
        };
        this.listenerRef = null;
    }

    componentWillMount() {
        nodejs.start('main.js');
        this.listenerRef = ((rel) => {
            this.setState({loading: false});
            let result = JSON.parse(rel);
            if (result.error) {
                Toast.show(result.message);
            }else {
                Toast.show('create success');
                storage.load({
                    key: 'accountList'
                }).then(res => {
                    res.push(result);
                    storage.save({
                        key: 'accountList',
                        data: res,
                    });
                    let pks=[];
                    for (let item of res) {
                        pks.push(item.privateKey);
                        nodejs.channel.send(JSON.stringify({data:pks,category:'accountChange'}));
                    }
                });
                this.props.navigation.goBack();
            }
        });
        nodejs.channel.addListener(
            'message',
            this.listenerRef,
            this
        );
    }

    componentWillUnmount() {
        if (this.listenerRef) {
            nodejs.channel.removeListener('message', this.listenerRef);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading === true ? <Loading/> : (null)}
                <View style={styles.row_container}>
                    <Text style={styles.welcome}>账号: </Text><TextInput style={styles.input}
                                                                       placeholder="请输入a-z 1-5的12位账号名称"
                                                                       onChangeText={(account) => this.setState({account: account})}>{this.state.account}</TextInput>
                </View>
                <Button title='create' style={styles.title} onPress={() => {
                    var createObj = {
                        category: 'createAccount',
                        account: this.state.account,
                    };
                    this.setState({loading:true});
                    nodejs.channel.send(JSON.stringify(createObj));
                }}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    row_container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 100,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        marginStart: 20,
        marginEnd: 20
    },
    title: {
        marginTop: 100,
        color: '#fff',
        fontSize: 24,
        width: 240,
        height: 50,
        backgroundColor: '#3285ff',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    input: {
        height: 50,
        width: 200,
        borderColor: '#3285FF',
    }
});
