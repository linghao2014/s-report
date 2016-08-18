/**
 * 群组
 */
import React from 'react';
import {FlatButton, IconButton, TextField, Toggle, Avatar, Table, Card,
    TableHeader, TableRow, TableRowColumn, TableHeaderColumn, TableBody,
    CardHeader, CardText, CardActions, Checkbox} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SetIcon from 'material-ui/svg-icons/action/settings';
import RespBox from 'cpn/resp_box';
import UserSearch from 'cpn/UserSearch';
import {style} from './index.scss';

const cover = 'http://p3.music.126.net/O__ztFTUL84GOTUFLY3u7g==/1391981724404463.jpg?param=50y50';

export default React.createClass({
    getInitialState() {
        return {};
    },
    render() {
        let barConf = {
            title: '编辑群组'
        };
        return (
            <RespBox className={style} barConf={barConf}>
                <div className="box">
                    <Card className="card">
                        <CardHeader title="基本信息" style={{paddingBottom: 0}}/>
                        <CardText style={{paddingTop: 0}}>
                            <TextField
                                className="text"
                                hintText="请输入名称"
                                floatingLabelText="组名"/>
                            <br/>
                            <TextField
                                multiLine
                                className="text"
                                hintText="请输入,多个用分号分割"
                                rowsMax={2}
                                floatingLabelText="邮件列表"/>
                        </CardText>
                        <CardActions>
                            <FlatButton primary label="保存"/>
                        </CardActions>
                    </Card>
                    <Card className="card">
                        <CardHeader title="小组成员" style={{paddingBottom: 0}}>
                            <IconButton
                                style={{position: 'absolute', right: 0,top:0}}
                                onTouchTap={this._addMember}>
                                <AddIcon/>
                            </IconButton>
                        </CardHeader>
                        <CardText>
                            <Table>
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn>序号</TableHeaderColumn>
                                        <TableHeaderColumn>姓名</TableHeaderColumn>
                                        <TableHeaderColumn>小组管理员</TableHeaderColumn>
                                        <TableHeaderColumn>操作</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false}>
                                    <TableRow selectable={false}>
                                        <TableRowColumn>1</TableRowColumn>
                                        <TableRowColumn>John Smith</TableRowColumn>
                                        <TableRowColumn><Checkbox/></TableRowColumn>
                                        <TableRowColumn><FlatButton secondary label="删除"/></TableRowColumn>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardText>
                    </Card>
                    <Card className="card">
                        <CardHeader title="关注设置" style={{paddingBottom: 0}}/>
                        <CardText>
                            <Toggle
                                labelPosition="right"
                                label="允许关注"/>
                            <div className="avatars">
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                                <Avatar src={cover}/>
                            </div>
                        </CardText>
                    </Card>
                </div>
                <UserSearch ref="search"/>
            </RespBox>
        );
    },
    _addMember() {
        this.refs.search.toggle(true);
    }
});