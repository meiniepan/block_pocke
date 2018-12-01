import React, { Component } from 'react';
import { StyleSheet, View, Text,Image } from 'react-native';

export default class AssetsPage extends Component {
    static navigationOptions = {
        tabBarLabel: '主页',
        tabBarIcon: ({ focused }) => (
            <Image
                source={focused ? require('../images/tabbar1_sel.png') : require('../images/tabbar1.png')}
                style={{ width: 26, height: 26}}
            />
        )
    }
    constructor() {
        super();

        this.state = {
            textInputValue: ''
        }
    }
    render() {
        let index = 0;
        const data = [
            { key: index++, section: true, label: 'Fruits' },
            { key: index++, label: 'Red Apples' },
            { key: index++, label: 'Cherries' },
            { key: index++, label: 'Cranberries' },
            { key: index++, label: 'Pink Grapefruit' },
            { key: index++, label: 'Raspberries' }
        ];
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    主页
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});