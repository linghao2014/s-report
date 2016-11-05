/**
 * 报告
 */
import React from 'react';
import {browserHistory} from 'react-router';
import {FlatButton, SelectField, TextField, MenuItem,FontIcon, IconButton,
    DatePicker, Toolbar, ToolbarGroup, RaisedButton, ToolbarSeparator} from 'material-ui';
import Bulleted from 'material-ui/svg-icons/editor/format-list-bulleted';
import Numbered from 'material-ui/svg-icons/editor/format-list-numbered';
import {fetch} from 'lib/util';
import popup from 'cpn/popup';
import pubsub from 'vanilla-pubsub';
import Editor from 'cpn/Editor';

const types = [
    <MenuItem key="day" value="day" primaryText="日报"/>,
    <MenuItem key="week" value="week" primaryText="周报"/>,
    <MenuItem key="month" value="month" primaryText="月报"/>
];

const iconStyle = {fontSize: '16px', fontWeight: 'bold', marginTop: '4px'};
const style = {
    margin: '30px',
    height: 'calc(100% - 60px)',
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
};


module.exports = React.createClass({
    getInitialState() {
        return {rp: this.props.location.state || {}};
    },
    componentDidMount() {
        let barConf = {
            title: (this.props.params.id ? '编辑' : '新建') + '简报'
        };
        pubsub.publish('config.appBar', barConf);
    },
    render() {
        let rp = this.state.rp;
        return (
            <div style={style}>
                <Toolbar>
                    <ToolbarGroup firstChild>
                        <SelectField
                            value={rp.type}
                            style={{width: '80px', margin: '4px 20px'}}
                            onChange={(e, k, v) => {this.state.rp.type = v;this.forceUpdate();}}
                            hintText="类型">
                            {types}
                        </SelectField>
                        <DatePicker
                            autoOk
                            value={rp.periodTime ? new Date(rp.periodTime) : null}
                            onChange={(e, date) => {this.state.rp.periodTime = date.getTime();this.forceUpdate();}}
                            style={{width: '120px', marginTop: '4px'}}
                            textFieldStyle={{width: '120px'}}
                            hintText="日期"/>
                    </ToolbarGroup>
                    <ToolbarGroup lastChild>
                        <IconButton
                            style={iconStyle}
                            onTouchTap={e => this.refs.editor.heading('h2')}>
                            H2
                        </IconButton>
                        <IconButton
                            style={iconStyle}
                            onTouchTap={e => this.refs.editor.heading('h3')}>
                            H3
                        </IconButton>
                        <IconButton
                            style={iconStyle}
                            onTouchTap={e => this.refs.editor.insertUnorderedList()}>
                            <Bulleted/>
                        </IconButton>
                        <IconButton
                            style={iconStyle}
                            onTouchTap={e => this.refs.editor.insertOrderedList()}>
                            <Numbered/>
                        </IconButton>
                        <ToolbarSeparator/>
                        <RaisedButton
                            primary
                            label="保存"
                            onTouchTap={this._handleSave}/>
                    </ToolbarGroup>
                </Toolbar>
                <Editor ref="editor" initContent={this.state.rp.content}/>
            </div>
        );
    },
    _onTypeChange(e, index, value) {
        this.setState({
            type: value
        });
    },
    _handleSave() {
        let rp = this.state.rp;
        if (!rp.type) {
            popup.error('请选择类型');
            return;
        }
        if (!rp.periodTime) {
            popup.error('请选择日期');
            return;
        }
        rp.content = this.refs.editor.getContent();
        if (!rp.content) {
            popup.error('请输入内容');
            return;
        }
        fetch('/api/report/' + (rp.id ? 'update' : 'create'), {
            method: 'post',
            body: {
                report: rp
            }
        })
            .then(d => {
                popup.success('保存成功');
                browserHistory.go(-1);
            })
            .catch(e => {
                popup.success(e.msg || '保存失败');
            });
    }
});