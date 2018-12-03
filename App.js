import React, {Component} from 'react';
import {AsyncStorage, Platform} from 'react-native';
import Storage from "react-native-storage";
import nodejs from "nodejs-mobile-react-native";
import Pages from './app/router/index';
import {Root} from "native-base";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
});


export default class App extends Component<> {

    componentWillMount() {
        global.storage = storage;
        nodejs.start('main.js');
        storage.load({
            key: 'accountList'
        }).then(res => {
            let pks = [];
            for (let item of res) {
                pks.push(item.privateKey);
            }
            nodejs.channel.send(JSON.stringify({data: pks, category: 'accountChange'}));
        });
    }

    render() {
        return (
            <Root>
                <Pages/>
            </Root>
        );
    }
}