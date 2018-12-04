
import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import Ping from 'react-native-ping';
import DataList from './node_list';

export default class App extends Component {
    static navigationOptions = {
        title: '节点选择',
    };

    constructor(props) {
        super(props);
        this.state = {
            nodeList: DataList
        }
        this.listenerRef = null;
    }

    componentWillMount() {
        nodejs.start('main.js');
        this.listenerRef = ((rel) => {
            let resultObj = JSON.parse(rel);
            if (resultObj.category === 'endPointChange') {
                let temp = resultObj.nodeItem;
                let nodeList = this.state.nodeList;
                for (let index = 0; index < nodeList.length; index++) {
                    const nodeItem = nodeList[index];
                    nodeItem.isDefault = false;
                    if (nodeItem.name === temp.name) {
                        nodeItem.isDefault = true;
                    }
                }
                this.setState({
                    nodeList: nodeList
                });
                storage.save({
                    key: 'nodeItem',
                    data: temp,
                });
            }
        });
        nodejs.channel.addListener(
            'message',
            this.listenerRef,
            this
        );
    }

    componentDidMount() {
        this._fetchDefaultNodeItem();
        this._fetchNodeItemDelay();
    }

    componentWillUnmount() {
        if (this.listenerRef) {
            nodejs.channel.removeListener('message', this.listenerRef);
        }
    }

    render() {
        return (
            <View style={styles.container}>
            <FlatList
                data = {this.state.nodeList}
                renderItem = {this._renderItem}
                keyExtractor = {(nodeItem) => nodeItem.name}
                extraData = {this.state}
                ItemSeparatorComponent = {this._separator}
            />
            </View>
        );
    }

    async _fetchDefaultNodeItem() {
        storage.load({
            key: 'nodeItem'
        }).then(res => {
            let nodeList = this.state.nodeList;
            for (let index = 0; index < nodeList.length; index++) {
                const nodeItem = nodeList[index];
                nodeItem.isDefault = false;
                if (nodeItem.name === res.name) {
                    nodeItem.isDefault = true;
                }
            }
            this.setState({
                nodeList: nodeList
            });
        }).catch(err => {
            
        }).finally(res => {
            
        });
    }

    async _fetchNodeItemDelay() {
        let nodeList = this.state.nodeList;
        for (let index = 0; index < nodeList.length; index++) {
            const nodeItem = nodeList[index];
            const delay = await Ping.start(nodeItem.address);
            nodeItem.delay = delay;
            this.setState({
                nodeList: nodeList
            });
        }
    }

    _renderItem = ({item}) => {
        let text = item.isDefault ? <Text style = {styles.name}>✔️</Text> : null;
        return (
            <TouchableOpacity
                onPress = {() => {
                    nodejs.channel.send(JSON.stringify({nodeItem: item, category: 'endPointChange'}));
                }}
            >
                <View style = {styles.cell}>
                    <View style = {styles.leftPart}>
                        <Text style = {styles.name}>{item.name}</Text>
                        {text}
                    </View>
                    <Text style = {styles.name}>{item.delay}ms</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _separator = () => {
        return <View style={{height:1,backgroundColor:'#E6E6E6'}}/>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop: 22,
    },
    list: {
        alignItems: 'center',
    },
    cell: {
        height: 44,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    leftPart: {
        flexDirection: 'row',
    },
    name: {
        fontSize: 14,
        color:'#333333',
        textAlign: 'center',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});