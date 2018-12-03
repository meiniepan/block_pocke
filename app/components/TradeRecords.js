import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, Image, View} from 'react-native';
import nodejs from "nodejs-mobile-react-native";


export default class FlatListBasics extends Component {

    constructor(props) {
        super(props);
        this.state = {sourceData: []};
        this.listenerRef = null;
        var transferBody = {
            category: 'block'
        };
        nodejs.start('main.js');
        this.listenerRef = ((rel) => {
            var arr1 = JSON.parse(rel).trans2;
            var arr2 = new Array();
            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr1[i].action_traces.length; j++) {

                    arr2.push((arr1[i].action_traces[j]))
                }
            }
            this.setState({account: arr2.length});
            this.setState({sourceData: arr2});
        });
        nodejs.channel.addListener(
            'message',
            this.listenerRef,
            this
        );
    }

    componentDidMount() {
        nodejs.channel.send(JSON.stringify(transferBody));

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
                <View style={styles.row_container}>
                    <Image style={styles.a1} source={require('./back_black.png')}/>
                    <Text style={styles.a2}>交易列表</Text>
                    <Text style={styles.a3}>选择</Text>
                </View>
                <FlatList
                    data={this.state.sourceData}
                    renderItem={({item}) => <Text style={styles.item}>{item.act.data.quantity}</Text>}
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
        backgroundColor: '#F5FCFF',
        flexDirection: 'row',
        padding: 20
    },

    a1: {
        width: 20,
        height: 20,
        justifyContent: 'flex-start'
    },
    a2: {
        fontSize: 20,
        textAlign: 'center',
        margin: 0,
        // justifyContent:'center',
    },
    a3: {
        fontSize: 16,
        textAlign: 'center',
        margin: 0,
        // justifyContent:'flex-end'
    },
})