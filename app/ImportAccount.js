/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import Toast from "react-native-root-toast/lib/Toast";

export default class Account extends Component<> {
    static navigationOptions = {
        title: 'Import Account',
    };

    constructor(props) {
        super(props);
        this.state = {
            account: 'ayiuivl52fnq',
            loading: false,
            pk: '5Hxgk9eLVfXF9LNPupGK3y7B3LukMRdraFyNdGiZfQKkUwhXUva'
        };
        this.listenerRef = null;
    }

    componentWillMount() {
        nodejs.start('main.js');
        this.listenerRef = ((rel) => {
            this.setState({loading: false});
            this.saveAccount(rel);
            this.props.navigation.goBack();
        });
        nodejs.channel.addListener(
            'message',
            this.listenerRef,
            this
        );
    }

     async saveAccount(rel) {
        // await AsyncStorage.setItem("account", "5Hxgk9eLVfXF9LNPupGK3y7B3LukMRdraFyNdGiZfQKkUwhXUva");
        // var pk = await AsyncStorage.getItem('account');
        // Toast.show('import success');
        // this.setState({pk:pk});
        var accountBean = JSON.parse(rel);
        if (accountBean.error) {
            Toast.show(accountBean.error);
            return;
        }
        var pks=[];
        storage.load({
            key: 'accountList'
        }).then(res => {
            res.push(accountBean);
            storage.save({
                key: 'accountList',
                data: res,
            });
            for (var item of res){
                pks.push(item.privateKey);
            }
        }).catch(err => {
            var accounts = [];
            accounts.push(accountBean);
            pks.push(accountBean.privateKey);
            storage.save({
                key: 'accountList',
                data: accounts,
            });
            this.saveDefaultAccount(accountBean.name);
        }).finally(res=>{
            nodejs.channel.send(JSON.stringify({data:pks,category:'accountChange'}));
        });
    }


    saveDefaultAccount(accountName) {
        storage.save({
            key: 'defaultAccount',
            data: accountName
        })
    }

    componentWillUnmount() {
        if (this.listenerRef) {
            nodejs.channel.removeListener('message', this.listenerRef);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={{height: 50, marginTop: 100, borderColor: 'gray', borderWidth: 1}}
                           placeholder="input your account here"
                           value={this.state.account}
                           onChangeText={(account) => this.setState({account: account})}/>
                <TextInput
                    style={{
                        height: 200,
                        borderColor: 'gray',
                        borderWidth: 1,
                        marginTop: 20,
                        marginBottom: 20,
                        textAlignVertical: 'top'
                    }}
                    multiline={true} placeholder="input your private key here"
                    value={this.state.pk}
                    onChangeText={(pk) => this.setState({pk: pk})}/>
                <Button title='import account' style={styles.title} onPress={() => {
                    let importObj = {
                        category: 'importAccount',
                        account: this.state.account,
                        pk: this.state.pk,
                    };
                    nodejs.channel.send(JSON.stringify(importObj));
                    // this.saveAccount();
                }}>import account</Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 24,
        width: 240,
        height: 50,
        backgroundColor: '#3285ff',
    },
    container: {
        flexDirection: 'column',
        marginStart: 20,
        marginEnd: 20,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
