import React, {Component} from 'react';
import {createAppContainer, createBottomTabNavigator, createStackNavigator} from 'react-navigation';

import AssetsPage from '../components/AssetsPage';
import DiscoverPage from '../components/DiscoverPage';
import InformationPage from '../components/InformationPage';
import MinePage from '../components/MinePage';
import CreateAccount from "../components/account/CreateAccount";
import ImportAccount from "../components/account/ImportAccount";
import Transfer from "../components/account/Transfer";
import ReceivePage from "../components/account/Receive";

// import { createStackNavigator, createMaterialTopTabNavigator, Header } from 'react-navigation';
// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

export default class Pages extends Component {
    static navigationOptions = {
        title: 'Index',
    };

    constructor(props) {
        super(props);
    }

    render() { //返回 APPNavigator
        return (
            <AppNavigator/>
        )
    }
}

const TabNavigator = createBottomTabNavigator({
    page1: {screen: AssetsPage},
    page2: {screen: DiscoverPage},
    page3: {screen: InformationPage},
    page4: {screen: MinePage},
}, {
    initialRouteName: 'page1', //初始路由
    backBehavior: 'none', //控制 "返回" 按钮是否返回到主页
    tabBarOptions: {
        activeTintColor: '#627DB9', //选中
        inactiveTintColor: '#000',  //默认
        showIcon: true, //是否展示图标
        showLabel: true, //展示标签
        style: { // 选项卡样式
            backgroundColor: '#fff',
            paddingBottom: 0,
            borderTopWidth: 0.5,
            borderTopColor: '#ccc',
        },
        labelStyle: { //选项卡内容样式
            fontSize: 12,
            margin: 1
        },
        indicatorStyle: {height: 0}, //android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
    },
});
TabNavigator.navigationOptions = {
    header: null
};

const StackNavigator = createStackNavigator({
    Pages: {screen: TabNavigator},
    Transfer: {screen: Transfer},
    CreateAccount: {screen: CreateAccount},
    ImportAccount: {screen: ImportAccount},
    Receive:{screen:ReceivePage}
});


const AppNavigator = createAppContainer(StackNavigator);

//module.exports = AppNavigator;