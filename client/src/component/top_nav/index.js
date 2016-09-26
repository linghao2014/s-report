/**
 * 一级导航
 */
import React from 'react';
import {Drawer, List, MakeSelectable, ListItem, RaisedButton, Avatar} from 'material-ui';
import {browserHistory} from 'react-router';
import _ from 'lodash';
import popup from 'cpn/popup';
import {fetch} from 'lib/util';
import {style} from './index.scss';

const SelectableList = MakeSelectable(List);
const navList = ['/report', '/team', '/group'];

export default React.createClass({
    getInitialState() {
        return {open: false};
    },
    componentDidMount() {
        this._unlisten = browserHistory.listen(this._historyChange);
    },
    componentWillUnmount() {
        this._unlisten();
    },
    shouldComponentUpdate(props, state) {
        return props.forceOpen != this.props.forceOpen
            || props.open != this.props.open
            || state.open != this.state.open
            || state.activeIndex != this.state.activeIndex;
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
                        <Avatar className="avatar">{_user.nickname.charAt(_user.nickname.length - 1)}</Avatar>
                        {_user.nickname}
                    </a>
                </div>
                <SelectableList value={this.state.activeIndex} onChange={this._navTo}>
                    <ListItem value={0} primaryText="报告"/>
                    <ListItem value={1} primaryText="小组"/>
                    {_user.groupAdmin ? <ListItem value={2} primaryText="组织设置"/> : null}
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
    _getSelectIndex() {
        if (location.pathname.startsWith('/report')) {
            return 0;
        } else if (location.pathname.startsWith('/team')) {
            return 1;
        } else if (location.pathname.startsWith('/group')) {
            return 2;
        }
    },
    _navTo(evt, index) {
        browserHistory.push(navList[index]);
    },
    _historyChange(location) {
        let index = _.findIndex(navList, path => location.pathname.startsWith(path));
        this.setState({activeIndex: index});
    },
    _logout() {
        this.setState({
            loading: true
        });
        fetch('/api/user/logout')
            .then(data => {
                this._unlisten();
                window._user = {};
                browserHistory.push('/index');
            })
            .catch(e => {
                popup.error('退出失败');
                this.setState({
                    loading: false
                });
            });
    }
});