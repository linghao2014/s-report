/**
 * 头像组件
 */
import React from 'react';
import {Avatar} from 'material-ui';

export default React.createClass({
    render() {
        let {avatarUrl, nickname} = this.props.user;
        return (<Avatar
            size={this.props.size}
            className={this.props.className}>
            {nickname.charAt(nickname.length - 1)}
        </Avatar>);
    }
});