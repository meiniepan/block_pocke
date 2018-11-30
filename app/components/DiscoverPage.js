import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
export default class DiscoverPage extends Component {
    static navigationOptions = {
        tabBarLabel: '发现',
        tabBarIcon: ({ focused, tintColor }) => (
            <Image
                source={focused ? require('../images/tabbar2_sel.png') : require('../images/tabbar2.png')}
                style={{ width: 26, height: 26}}
            />
        )
    };
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    发现问题
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    textView: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
        color:'red'
    },
});