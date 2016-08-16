/**
 * 报告
 */
import React from 'react';
import {Dialog, FlatButton, SelectField, TextField, MenuItem} from 'material-ui';
import {edit} from './index.scss';

const types = [
    <MenuItem key="day" value="day" primaryText="日报" />,
    <MenuItem key="week" value="week" primaryText="周报" />,
    <MenuItem key="month" value="month" primaryText="月报" />
];

const timeMap = {
    day: [],
    week: [],
    month: []
};


export default React.createClass({
    getInitialState() {
        return {open: false};
    },
    render() {
        let actions = [
            <FlatButton
                primary
                label="取消"
                onTouchTap={this._handleClose}
            />,
            <FlatButton
                primary
                keyboardFocused
                label="保存"
                onTouchTap={this._handleOk}
            />
        ];
        return (
            <Dialog
                modal
                className={edit}
                title="编辑"
                actions={actions}
                open={this.state.open}>
                <div className="select">
                    <SelectField
                        name="type"
                        floatingLabelText="类型">
                        {types}
                    </SelectField>
                    <SelectField
                        name="time"
                        floatingLabelText="时间">
                        <MenuItem value={1} primaryText="今天" />
                        <MenuItem value={2} primaryText="昨天" />
                        <MenuItem value={3} primaryText="前天" />
                    </SelectField>
                </div>
                <TextField
                    multiLine
                    fullWidth
                    rowsMax={2}
                    hintText="请输入内容,按回车结束"
                    name="content"/>
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
    }
});