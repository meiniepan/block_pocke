import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, Image, View} from 'react-native';
import nodejs from "nodejs-mobile-react-native";


export default class FlatListBasics extends Component {
    static navigationOptions = {
        title: '交易记录',
    };

    constructor(props) {
        super(props);
        this.state = {sourceData: [], account: ''};
        this.listenerRef = null;

        nodejs.start('main.js');
        this.listenerRef = ((rel) => {
            let arr1 = JSON.parse(rel).trans2;
            let arr2 = new Array();
            let otherAccount, tradeSymbol, quantity, time
            for (let i = 0; i < arr1.length; i++) {
                time = arr1[i].createdAt
                time = time.substr(0,10)+" "+time.substr(11,8)
                for (let j = 0; j < arr1[i].action_traces.length; j++) {
                    if (arr1[i].action_traces[j].act.data.from == (this.state.account)
                        && arr1[i].action_traces[j].act.data.quantity != null
                    ) {
                        otherAccount = arr1[i].action_traces[j].act.data.to
                        tradeSymbol = '- '
                        quantity = arr1[i].action_traces[j].act.data.quantity
                        arr2.push({
                            otherAccount: otherAccount,
                            tradeSymbol: tradeSymbol,
                            quantity: quantity,
                            time: time
                        })
                    } else if (arr1[i].action_traces[j].act.data.to == (this.state.account)
                        && arr1[i].action_traces[j].act.data.quantity != null
                    ) {
                        otherAccount = arr1[i].action_traces[j].act.data.from
                        tradeSymbol = '+ '
                        quantity = arr1[i].action_traces[j].act.data.quantity
                        arr2.push({
                            otherAccount: otherAccount,
                            tradeSymbol: tradeSymbol,
                            quantity: quantity,
                            time: time
                        })
                    }

                }
            }
            arr2.reverse()
            this.setState({sourceData: arr2});
        });
        nodejs.channel.addListener(
            'message',
            this.listenerRef,
            this
        );
    }

    componentDidMount() {
        storage.load({
            key: 'defaultAccount'
        }).then(res => {
            this.setState({account: res})
            nodejs.channel.send(JSON.stringify({category: 'tradeRecords', account: res}));
        });
    }

    componentWillUnmount() {
        if (this.listenerRef) {
            nodejs.channel.removeListener('message', this.listenerRef);
        }
    }

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{height: 1, backgroundColor: '#000'}}></View>
    );

    render() {

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.sourceData}
                    renderItem={({item}) => <View style={styles.row_container}>
                        <View style={styles.row_container_1}>
                            <Text style={styles.a2}>
                                {item.otherAccount}
                            </Text>
                            <Text style={styles.a22}>
                                {item.time}
                            </Text>
                        </View>
                        <Text style={styles.a3}>{item.tradeSymbol + item.quantity}</Text>
                    </View>}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },

    row_container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10
    },
    row_container_1: {
        justifyContent: 'flex-start'
    },

    a1: {
        width: 20,
        height: 20,
        justifyContent: 'flex-start'
    },
    a2: {
        fontSize: 20,
        color:'#333',
        margin: 0,
        // justifyContent:'center',
    },
    a22: {
        fontSize: 16,
        color:'#999',
        margin: 0,
    },
    a3: {
        fontSize: 22,
        color:'#333',
        textAlign: 'center',
        margin: 0,
    },
})