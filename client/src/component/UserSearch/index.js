/**
 * 用户查找组件
 */
import React from 'react';
import {Dialog, FlatButton, AutoComplete, Chip} from 'material-ui';
import {fetch} from 'lib/util';

const sourceConf = {text: 'nickname', value: 'id'};

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
                label="确定"
                onTouchTap={this._handleOk}/>
        ];
        return (
            <Dialog
                contentStyle={{maxWidth: '450px'}}
                title="选择用户"
                actions={actions}
                open={this.state.open}>
                <Chip onRequestDelete={e=>e}>展示</Chip>
                <AutoComplete
                    openOnFocus
                    maxSearchResults={6}
                    hintText="输入姓名查找"
                    floatingLabelText="搜索用户"
                    dataSourceConfig={sourceConf}
                    dataSource={this.state.dataSource}
                    onNewRequest={this._handleRequest}
                    onUpdateInput={this._handleUpdateInput}
                    fullWidth={true}/>
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
        this.toggle(false);
    },
    _handleUpdateInput(value) {
        fetch('/api/user/search?name=' + value)
            .then(d => {
                this.setState({
                    dataSource: d.list
                });
            });
    },
    _handleRequest(e) {
        debugger
    }
});