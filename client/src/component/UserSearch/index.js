/**
 * 用户查找组件
 */
import React from 'react';
import {Dialog, FlatButton, AutoComplete, Chip} from 'material-ui';

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
                title="选择用户"
                actions={actions}
                open={this.state.open}>
                <Chip onRequestDelete={e=>e}>展示</Chip>
                <AutoComplete
                    hintText="输入姓名查找"
                    floatingLabelText="搜索用户"
                    dataSource={this.state.dataSource}
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
    _handleUpdateInput() {

    }
});