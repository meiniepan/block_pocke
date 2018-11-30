import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Container, Button, Text } from 'native-base';

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
    render() {
        return (
            <View style={styles.container}>
                <Container>
                    <Button>
                        <Text>
                            主页
                        </Text>
                    </Button>
                </Container>
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