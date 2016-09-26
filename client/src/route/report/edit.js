/**
 * 报告
 */
import React from 'react';
import {Dialog, FlatButton, SelectField, TextField, MenuItem} from 'material-ui';
import {edit} from './index.scss';

const types = [
    <MenuItem key="day" value="day" primaryText="日报"/>,
    <MenuItem key="week" value="week" primaryText="周报"/>,
    <MenuItem key="month" value="month" primaryText="月报"/>
];

const timeMap = {
    day: [
        Object.assign(getPeriod(), {text: '今天'}),
        Object.assign(getPeriod({date: -1}), {text: '昨天'}),
        Object.assign(getPeriod({date: -2})),
        Object.assign(getPeriod({date: -3})),
        Object.assign(getPeriod({date: -4}))
    ],
    week: [
        Object.assign(getPeriod(), {text: '本周'}),
        Object.assign(getPeriod({date: -7}), {text: '上周'})
    ],
    month: [
        Object.assign(getPeriod(), {text: '本月'}),
        Object.assign(getPeriod({month: -1}), {text: '上月'})
    ]
};

function getPeriod(delta) {
    let date = new Date();
    if (delta) {
        delta.date && date.setDate(date.getDate() + delta.date);
        delta.month && date.setMonth(date.getMonth() + delta.month);
    }
    let ret = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        week: 2
    };
    ret.text = `${ret.year}/${ret.month}/${ret.date}`;
    return ret;
}


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
        let timeList = timeMap[this.state.type] || [];
        return (
            <Dialog
                modal
                className={edit}
                title="编辑"
                actions={actions}
                open={this.state.open}>
                <div className="select">
                    <SelectField
                        value={this.state.type}
                        onChange={this._onTypeChange}
                        name="type"
                        floatingLabelText="类型">
                        {types}
                    </SelectField>
                    <SelectField
                        disabled={!timeList.length}
                        value={this.state.periodTime}
                        onChange={this._onTimeChange}
                        name="time"
                        floatingLabelText="时间">
                        {
                            timeList.map(x => <MenuItem key={x.text} value={x} primaryText={x.text}/>)
                        }
                    </SelectField>
                </div>
                <TextField
                    multiLine
                    fullWidth
                    value={this.state.content}
                    onChange={this._onContentChange}
                    rowsMax={6}
                    hintText="请输入内容"
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
        if (this.props.onOk) {
            this.props.onOk({
                type: this.state.type,
                periodTime: this.state.periodTime,
                content: this.state.content.split('\n').map(x => ({text: x}))
            });
        }
        this.toggle(false);
    },
    _onTypeChange(evt, index, value) {
        this.setState({
            type: value,
            periodTime: timeMap[value][0]
        });
    },
    _onTimeChange(evt, index, value) {
        this.setState({
            periodTime: value
        });
    },
    _onContentChange(e) {
        this.setState({content: e.target.value});
    }
});