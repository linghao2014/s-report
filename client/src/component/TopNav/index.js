/**
 * 顶级导航
 */
import React from 'react';
import {Drawer, List, MakeSelectable, ListItem, RaisedButton, Avatar} from 'material-ui';
import DescIcn from 'material-ui/svg-icons/action/description';
import TeamIcn from 'material-ui/svg-icons/action/supervisor-account';
import AdminIcn from 'material-ui/svg-icons/action/verified-user';
import {browserHistory} from 'react-router';
import _ from 'lodash';
import popup from 'cpn/popup';
import {fetch} from 'lib/util';
import {style} from './index.scss';
import pubsub from 'vanilla-pubsub';

const SelectableList = MakeSelectable(List);
const navList = ['/m/report/my/list', '/m/report/team', '/m/team', '/m/group'];
const innerDiv = {paddingLeft: 50};

export default React.createClass({
    getInitialState() {
        return {
            open: false,
            current: _.findIndex(navList, x => location.pathname.startsWith(x)),
            loginUser: window._user
        };
    },
    componentWillMount() {
        pubsub.subscribe('loginUser.change', this._upLoginUser);
    },
    componentWillUnmount() {
        pubsub.unsubscribe('loginUser.change', this._upLoginUser);
    },
    _upLoginUser(u) {
        this.setState({loginUser: u});
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
                        <Avatar
                            className="avatar">{this.state.loginUser.nickname.charAt(this.state.loginUser.nickname.length - 1)}</Avatar>
                        {this.state.loginUser.nickname}
                    </a>
                </div>
                <SelectableList
                    style={{display: this.state.loginUser.groupId ? 'block': 'none'}}
                    value={this.state.current}
                    onChange={this._navTo}>
                    <ListItem
                        value={-1}
                        primaryTogglesNestedList
                        initiallyOpen
                        primaryText="报告"
                        leftIcon={<DescIcn/>}
                        innerDivStyle={innerDiv}
                        nestedItems={[
                        <ListItem
                          value={0}
                          primaryText="我的"/>,
                        <ListItem
                          value={1}
                          primaryText="小组"/>
                    ]}/>
                    <ListItem
                        value={2}
                        leftIcon={<TeamIcn/>}
                        innerDivStyle={innerDiv}
                        primaryText="小组"/>
                    {this.state.loginUser.groupAdmin ?
                        <ListItem value={3} leftIcon={<AdminIcn/>} innerDivStyle={innerDiv}
                                  primaryText="管理员设置"/> : null}
                </SelectableList>
                <RaisedButton
                    disabled={this.state.loading}
                    onClick={this._logout}
                    className="logout"
                    label={this.state.loading ? '退出中...' : '退出'}
                    secondary/>
            </Drawer>
        );
    },
    _navTo(evt, index) {
        this.setState({current: index});
        browserHistory.push(navList[index]);
    },
    _logout() {
        this.setState({
            loading: true
        });
        fetch('/api/user/logout')
            .then(d => {
                window._user = {};
                browserHistory.push('/index');
            })
            .catch(e => {
                debugger
                popup.error('退出失败');
                this.setState({
                    loading: false
                });
            });
    }
});