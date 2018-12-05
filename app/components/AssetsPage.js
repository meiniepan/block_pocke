/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ActionSheet, Button, Card, CardItem, Text, Toast} from "native-base";
import nodejs from "nodejs-mobile-react-native";
import PopupWindow from "./widget/AssetsPopupWindow";

export default class AssetsPage extends Component<> {
    static navigationOptions = {
        tabBarLabel: '主页',
        tabBarIcon: ({focused}) => (
            <Image
                source={focused ? require('../images/tabbar1_sel.png') : require('../images/tabbar1.png')}
                style={{width: 26, height: 26}}
            />
        )
    };

    constructor(props) {
        super(props);
        this.state = {
            account: 'no default account',
            accounts: [],
            accountNames: [],
            RAM: '',
            balance: '',
            popShow: false
        };
        this.listenerRef = null;
    }

    componentWillMount() {
        nodejs.start('main.js');
        this.listenerRef = ((rel) => {
            var resultBean = JSON.parse(rel);
            if (resultBean.error) {
                Toast.show(resultBean.error.message);
                return;
            }
            if (resultBean.category === 'getAccountInfo') {
                this.setState({RAM: resultBean.ram_usage})
            } else if (resultBean.category === 'getBalance') {
                this.setState({balance: resultBean.balance})
            } else if (resultBean.category === 'accountChange') {
                this.loadData()
            }
        });
        nodejs.channel.addListener(
            'message',
            this.listenerRef,
            this
        );
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.loadAccountData();
        this.loadAccountList()
    }

    loadAccountData() {
        storage.load({
            key: 'defaultAccount'
        }).then(res => {
            this.setState({account: res});
            nodejs.channel.send(JSON.stringify({category: 'getAccountInfo', account: res}));
            nodejs.channel.send(JSON.stringify({category: 'getBalance', account: res}));
        });
    }

    loadAccountList() {
        storage.load({
            key: 'accountList'
        }).then(res => {
            this.setState({accounts: res});
            var names = [];
            for (var account of res) {
                names.push(account.name);
            }
            this.setState({accountNames: names});
        });
    }

    componentWillUnmount() {

    }

    saveDefaultAccount(accountName) {
        storage.save({
            key: 'defaultAccount',
            data: accountName
        })
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<NavigationEvents*/}
                {/*onWillFocus={payload=>console.log('onWillFocus')}*/}
                {/*onDidFocus={payload => this.loadData()}*/}
                {/*onWillBlur={payload=>console.log('onWillBlur')}*/}
                {/*onDidBlur={payload=>console.log('onDidBlur')}*/}
                {/*/>*/}
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button rounded light style={styles.button} onPress={() => {
                        ActionSheet.show({
                                options: this.state.accountNames,
                                title: "choose account"
                            },
                            buttonIndex => {
                                if (buttonIndex !== undefined) {
                                    let accountName = this.state.accountNames[buttonIndex];
                                    this.setState({account: accountName});
                                    this.saveDefaultAccount(accountName);
                                    this.loadAccountData();
                                }
                            })
                    }}>
                        <Text>{this.state.account}</Text>
                    </Button>

                    <Button transparent onPress={() => {
                        this.setState({popShow: true});
                    }}><Text style={{fontSize: 28, textColor: '#2a2a2a'}}>+</Text></Button>
                </View>

                <Card style={{marginTop: 20}}>
                    <CardItem header bordered>
                        <Text>{this.state.account}</Text>
                    </CardItem>
                    <CardItem>
                        <Text>账户总额度：</Text><Text>{this.state.balance}</Text>
                    </CardItem>
                    <CardItem>
                        <Text>可用余额：</Text><Text>{this.state.balance}</Text>
                    </CardItem>
                    <CardItem>
                        <Text>已抵押资源：</Text><Text> 1.000 EOS</Text>
                    </CardItem>
                    <CardItem>
                        <Text>RAM：</Text><Text> {this.state.RAM}</Text>
                    </CardItem>
                </Card>

                <Card style={{marginTop: 20}}>
                    <CardItem>
                        <Button transparent style={styles.row_container} onPress={() => {
                            this.props.navigation.push('Transfer')
                        }}><Text>转账</Text></Button>
                        <Text>|</Text>
                        <Button transparent style={styles.row_container} onPress={() => {
                            this.props.navigation.push('Receive')
                        }}><Text>收款</Text></Button>
                    </CardItem>
                </Card>
                <View style={{flexDirection: 'row', height: 50, marginTop: 20}}>
                    <Button primary style={styles.row_container} onPress={() => {
                        this.props.navigation.push('CreateAccount')
                    }}><Text>创建</Text></Button>
                    <View style={{marginStart: 10, marginEnd: 10}}/>
                    <Button primary style={styles.row_container} onPress={() => {
                        this.props.navigation.push('ImportAccount', {
                            account: this.state.account
                        })
                    }}><Text>导入</Text></Button>
                </View>
                <PopupWindow show={this.state.popShow} navigation={this.props.navigation} closeModal={(show) => {
                    this.setState({popShow: show})
                }} dataArray={['扫一扫', '转账', '收款', '交易记录']}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color: '#000',
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        padding: 10,
        width: 200,
        height: 50,
    },
    row_container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    button: {
        paddingLeft: 12,
        paddingRight: 12,
    },
    container: {
        marginTop: 20,
        color: '#fff',
        flexDirection: 'column',
        marginStart: 20,
        marginEnd: 20,
    },
    welcome: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
