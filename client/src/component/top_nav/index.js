/**
 * 一级导航
 */
import React from 'react';
import {Drawer, Menu, MenuItem, RaisedButton, Avatar} from 'material-ui';
import {style} from './index.scss';

export default React.createClass({
    getInitialState() {
        return {open: false};
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
                    <Avatar className="avatar" src="http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=200y200"/>
                    李大伟
                    </a>
                </div>
                <Menu>
                    <MenuItem primaryText="报告"/>
                    <MenuItem primaryText="群组"/>
                    <MenuItem primaryText="管理员设置"/>
                </Menu>
                <RaisedButton
                    className="logout"
                    label="退出"
                    secondary/>
            </Drawer>
        );
    }
});