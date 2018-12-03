import React, {Component} from 'react';

export default class TimeBank extends React.Component<> {
    static navigationOptions = {
        title: 'tb'
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.listenerRef = null;
    }
}