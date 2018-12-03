/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import Loading from "../Loading";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export default class Transfer extends Component<> {
    static navigationOptions = {
        title: 'Transfer',
    };

    constructor(props) {
        super(props);
        this.state = {
            account: 'here is result',
            from: 'ayiuivl52fnq',
            to: 'mukang123123',
            amount: '1.0000 EOS',
            memo: 'HHH',
            loading: "false"
        };
        this.listenerRef = null;
    }

    componentWillMount() {
        nodejs.start('main.js');
        this.listenerRef = ((rel) => {
            this.setState({account: rel.toString(), loading: false});
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
        const {navigation} = this.props;
        return (
            <ScrollView style={styles.container}>
                {this.state.loading === true ? <Loading/> : (null)}
                <View style={styles.row_container}>
                    <Text style={styles.welcome}>from: </Text><TextInput style={styles.input}
                                                                         onChangeText={(from) => this.setState({from: from})}>{this.state.from}</TextInput>
                </View>
                <View style={styles.row_container}>
                    <Text style={styles.welcome}>to: </Text><TextInput style={styles.input}
                                                                       onChangeText={(to) => this.setState({to: to})}/>
                </View>
                <View style={styles.row_container}>
                    <Text style={styles.welcome}>amount: </Text><TextInput style={styles.input}
                                                                           onChangeText={(amount) => this.setState({amount: amount})}>{this.state.amount}</TextInput>
                </View>
                <View style={styles.row_container}>
                    <Text style={styles.welcome}>memo: </Text><TextInput style={styles.input}
                                                                         onChangeText={(memo) => this.setState({memo: memo})}/>
                </View>
                <Text style={styles.welcome}/>
                <Button title="转账"
                        onPress={() => {
                            var transferBody = {
                                category: "transfer",
                                from: this.state.from,
                                to: this.state.to,
                                memo: this.state.memo,
                                quantity: this.state.amount,
                            };
                            this.setState({loading: true});
                            nodejs.channel.send(JSON.stringify(transferBody));
                        }
                        }
                />
                <Text style={styles.welcome}>{this.state.account}</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    row_container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flexDirection: 'row',
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        flexDirection: 'column',
        marginStart: 20,
        marginEnd: 20
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
