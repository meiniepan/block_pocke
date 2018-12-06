import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
export default class MinePage extends Component {
    static navigationOptions = {
        tabBarLabel: '我的',
        tabBarIcon: ({ focused, tintColor }) => (
            <Image
                source={focused ? require('../images/tabbar1_sel.png') : require('../images/tabbar1.png')}
                style={{ width: 26, height: 26}}
            />
        )
    };
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={[
                        {key: '节点选择'},
                        {key: '交易记录'},
                        {key: '管理钱包'},
                        {key: '推荐好友'},
                        {key: '语言设置'},
                        {key: '安全'},
                        {key: '关于我们'},
                    ]}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress = {() => {
                    if (item.key === '节点选择') {
                        this.props.navigation.push('NodeList');
                    }else if (item.key === '交易记录') {
                        this.props.navigation.push('TradeRecords');
                    }
                }}
            >
                <Text style={styles.item}>{item.key}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
    },
});