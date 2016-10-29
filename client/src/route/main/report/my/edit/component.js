/**
 * 报告
 */
import React from 'react';
import {FlatButton, SelectField, TextField, MenuItem, DatePicker} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import {fetch} from 'lib/util';
import popup from 'cpn/popup';
import pubsub from 'vanilla-pubsub';

const types = [
    <MenuItem key="day" value="day" primaryText="日报"/>,
    <MenuItem key="week" value="week" primaryText="周报"/>,
    <MenuItem key="month" value="month" primaryText="月报"/>
];


module.exports = React.createClass({
    getInitialState() {
        return {};
    },
    componentDidMount() {
        let barConf = {
            title: '报告'
        };
        pubsub.publish('config.appBar', barConf);
    },
    render() {
        return (
            <div style={{padding: 30}}>
                <SelectField
                    value={this.state.type}
                    onChange={this._onTypeChange}
                    name="type"
                    hintText="类型">
                    {types}
                </SelectField>
                <DatePicker
                    hintText="时间"
                    onChange={(e, date) => this.setState({date: date})}
                    mode="landscape"/>
                <TextField
                    hintText="内容"
                    multiLine={true}
                    rows={2}
                    onChange={e => this.setState({content: e.target.value})}
                    rowsMax={4}/>
                <br/>
                <FlatButton
                    primary
                    label="保存"
                    onTouchTap={this._handleSave}/>
            </div>
        );
    },
    _onTypeChange(e, index, value) {
        this.setState({
            type: value
        });
    },
    _handleSave() {
        fetch('/api/report/create', {
            method: 'post',
            body: {
                report: {
                    type: this.state.type,
                    content: this.state.content,
                    periodTime: this.state.date.getTime()
                }
            }
        })
            .then(d => {
                popup.success('创建成功');
            })
            .catch(e => {
                popup.success(e.msg || '创建失败');
            });
    }
});