/**
 * 创建群组
 */
import React from 'react';
import {Dialog, FlatButton, TextField} from 'material-ui';
import {browserHistory} from 'react-router';
import {fetch} from 'lib/util';

export default React.createClass({
    getInitialState() {
        return {open: false, dataSource: []};
    },
    render() {
        let actions = [
            <FlatButton
                primary
                label="取消"
                onTouchTap={this._handleClose}/>,
            <FlatButton
                primary
                keyboardFocused
                label="确定"
                onTouchTap={this._handleOk}/>
        ];
        return (
            <Dialog
                contentStyle={{maxWidth: '450px'}}
                title="创建组织"
                actions={actions}
                open={this.state.open}>
                <TextField
                    fullWidth
                    onChange={e => this.setState({name: e.target.value})}
                    hintText="组织名称"
                    name="name"/>
            </Dialog>
        );
    },
    toggle(open) {
        this.setState({
            open: open
        });
    },
    _handleClose() {
        this.toggle(false);
    },
    _handleOk() {
        fetch('/api/group/create', {method: 'post', body: {name: this.state.name}})
            .then(data => {
                window._user.groupId = data.group.id;
                this.toggle(false);
                browserHistory.replace('/group');
            })
            .catch(e => {
                this.toggle(false);
            });
    }
});