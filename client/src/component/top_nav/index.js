/**
 * 一级导航
 */
import React from 'react';
import {Drawer, Menu, MenuItem, RaisedButton, Avatar} from 'material-ui';
import {browserHistory} from 'react-router';
import {fetch} from 'lib/util';
import {style} from './index.scss';

export default React.createClass({
    getInitialState() {
        return {open: false};
    },
    shouldComponentUpdate(props, state) {
        return props.forceOpen != this.props.forceOpen
            || props.open != this.props.open
            || state.open != this.state.open;
    },
    render() {
        return (
            <Drawer
                className={style}
                open={this.props.forceOpen || this.props.open}
                onRequestChange={this.props.onRequestChange}>
                <h1>简报</h1>
                <div className="user">
                    <a href="#">
                        <Avatar className="avatar"
                                src="http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200"/>
                        {_user.nickname}
                    </a>
                </div>
                <Menu style={{width: '256px'}}>
                    <MenuItem onClick={e => browserHistory.push('/report')} primaryText="报告"/>
                    <MenuItem onClick={e => browserHistory.push('/team')} primaryText="小组"/>
                    <MenuItem onClick={e => browserHistory.push('/group')} primaryText="组织设置"/>
                </Menu>
                <RaisedButton
                    onClick={this._logout}
                    className="logout"
                    label="退出"
                    secondary/>
            </Drawer>
        );
    },
    _logout() {
        fetch('/api/user/logout')
            .then(data => {
                window._user = {};
                browserHistory.push('/index');
            });
    }
});